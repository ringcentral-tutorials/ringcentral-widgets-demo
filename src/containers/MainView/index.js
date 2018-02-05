import React from 'react';
import { connect } from 'react-redux';

import callingOptions from 'ringcentral-integration/modules/CallingSettings/callingOptions';
import withPhone from 'ringcentral-widgets/lib/withPhone';

import TabNavigationView from 'ringcentral-widgets/components/TabNavigationView';

import DialPadIcon from 'ringcentral-widgets/assets/images/DialPadNav.svg';
import CallsIcon from 'ringcentral-widgets/assets/images/Calls.svg';
import HistoryIcon from 'ringcentral-widgets/assets/images/CallHistory.svg';
import MessageIcon from 'ringcentral-widgets/assets/images/Messages.svg';
import SettingsIcon from 'ringcentral-widgets/assets/images/Settings.svg';
import MoreMenuIcon from 'ringcentral-widgets/assets/images/MoreMenu.svg';
import ContactIcon from 'ringcentral-widgets/assets/images/Contact.svg';

import DialPadHoverIcon from 'ringcentral-widgets/assets/images/DialPadHover.svg';
import CallsHoverIcon from 'ringcentral-widgets/assets/images/CallsHover.svg';
import HistoryHoverIcon from 'ringcentral-widgets/assets/images/CallHistoryHover.svg';
import MessageHoverIcon from 'ringcentral-widgets/assets/images/MessagesHover.svg';
import SettingsHoverIcon from 'ringcentral-widgets/assets/images/SettingsHover.svg';
import MoreMenuHoverIcon from 'ringcentral-widgets/assets/images/MoreMenuHover.svg';
import ContactHoverIcon from 'ringcentral-widgets/assets/images/ContactHover.svg';

import SettingsNavIcon from 'ringcentral-widgets/assets/images/SettingsNavigation.svg';

const TABS = [
  {
    icon: SettingsIcon,
    activeIcon: SettingsHoverIcon,
    label: 'Settings',
    path: '/settings',
    isActive: currentPath => (
      currentPath.substr(0, 9) === '/settings'
    ),
  }
];

function mapToProps(_, {
  phone: {
    routerInteraction,
  },
}) {
  return {
    tabs: TABS,
    currentPath: routerInteraction.currentPath,
  };
}
function mapToFunctions(_, {
  phone: {
    routerInteraction,
  }
}) {
  return {
    goTo: (path) => {
      if (path) {
        routerInteraction.push(path);
      }
    },
  };
}

const MainView = withPhone(connect(
  mapToProps,
  mapToFunctions
)(TabNavigationView));

export default MainView;
