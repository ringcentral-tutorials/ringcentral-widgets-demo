import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import callingModes from 'ringcentral-integration/modules/CallingSettings/callingModes';
import withPhone from 'ringcentral-widgets/lib/withPhone';
import OfflineModeBadge from 'ringcentral-widgets/components/OfflineModeBadge';
import WebphoneBadge from 'ringcentral-widgets/components/WebphoneBadge';
import Environment from 'ringcentral-widgets/components/Environment';

import styles from './styles.scss';

function AppView(props) {
  const {
    offline,
    webphoneUnavailable,
    onWebphoneBadgeClicked,
  } = props;
  let badge = null;
  if (offline) {
    badge = (
      <OfflineModeBadge
        offline={props.offline}
        showOfflineAlert={props.showOfflineAlert}
        currentLocale={props.currentLocale}
      />);
  } else if (webphoneUnavailable) {
    badge = (
      <WebphoneBadge
        currentLocale={props.currentLocale}
        onClick={onWebphoneBadgeClicked}
      />);
  }
  return (
    <div className={styles.root}>
      {props.children}
      {badge}
      <Environment
        server={props.server}
        enabled={props.enabled}
        onSetData={props.onSetData}
        redirectUri={props.redirectUri}
        recordingHost={''}
      />
    </div>
  );
}

AppView.propTypes = {
  children: PropTypes.node,
  server: PropTypes.string,
  enabled: PropTypes.bool,
  onSetData: PropTypes.func,
  currentLocale: PropTypes.string.isRequired,
  offline: PropTypes.bool.isRequired,
  showOfflineAlert: PropTypes.func.isRequired,
  redirectUri: PropTypes.string.isRequired,
  webphoneUnavailable: PropTypes.bool.isRequired,
  onWebphoneBadgeClicked: PropTypes.func.isRequired,
};

AppView.defaultProps = {
  children: null,
  server: null,
  appSecret: null,
  appKey: null,
  enabled: false,
  onSetData: undefined,
};

export default withPhone(connect((_, {
  phone: {
    locale,
    oAuth,
    environment,
    connectivityMonitor,
    rateLimiter,
    auth,
    webphone,
    audioSettings,
    callingSettings,
  }
}) => ({
  currentLocale: locale.currentLocale,
  server: environment.server,
  enabled: environment.enabled,
  offline: (
    !connectivityMonitor.connectivity ||
    oAuth.proxyRetryCount > 0 ||
    rateLimiter.throttling
  ),
  redirectUri: oAuth.redirectUri,
  webphoneUnavailable: (
    auth.ready &&
    audioSettings.ready &&
    webphone.ready &&
    auth.loggedIn && (
      callingSettings.callingMode === callingModes.webphone &&
      (
        !audioSettings.userMedia ||
        !!webphone.errorCode
      )
    )
  ),
}), (_, {
  phone: {
    environment,
    connectivityMonitor,
    rateLimiter,
    callingSettings,
    audioSettings,
    webphone,
  },
}) => ({
  onSetData: (options) => {
    environment.setData(options);
  },
  showOfflineAlert: () => {
    rateLimiter.showAlert();
    connectivityMonitor.showAlert();
  },
  onWebphoneBadgeClicked: () => {
    // Only works for webphone mode
    if (callingSettings.callingMode !== callingModes.webphone) {
      return;
    }
    if (audioSettings && audioSettings.ready) {
      audioSettings.showAlert();
      audioSettings.getUserMedia();
    }
    if (webphone && webphone.ready) {
      // Trigger reconnect
      // webphone.connect();
      webphone.showAlert();
    }
  }
}))(AppView));
