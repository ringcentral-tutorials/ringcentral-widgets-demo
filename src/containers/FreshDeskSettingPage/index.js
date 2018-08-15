import React from 'react';
import { connect } from 'react-redux';
import withPhone from 'ringcentral-widgets/lib/withPhone';

import FreshDeskSettingPanel from '../../components/FreshDeskSettingPanel';

function mapToProps(_, {
  phone: {
    freshDeskAdapter,
  }
}) {
  return {
    apiKey: freshDeskAdapter.apiKey,
    baseUri: freshDeskAdapter.baseUri,
  };
}

function mapToFunctions(_, {
  phone: {
    freshDeskAdapter,
    routerInteraction,
  }
}) {
  return {
    onSaveSettings(key, baseUri) {
      freshDeskAdapter.updateSettings(key, baseUri);
      routerInteraction.push('/dialer');
    }
  };
}

const FreshDeskSettingPage = withPhone(connect(
  mapToProps,
  mapToFunctions,
)(FreshDeskSettingPanel));

export default FreshDeskSettingPage;
