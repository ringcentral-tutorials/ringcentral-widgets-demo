import React from 'react';
import { connect } from 'react-redux';

import { withPhone } from '@ringcentral-integration/widgets/lib/phoneContext';

import TabNavigationView from '@ringcentral-integration/widgets/components/TabNavigationView';

import HistoryIcon from '@ringcentral-integration/widgets/assets/images/CallHistory.svg';
import SettingsIcon from '@ringcentral-integration/widgets/assets/images/Settings.svg';

import HistoryHoverIcon from '@ringcentral-integration/widgets/assets/images/CallHistoryHover.svg';
import SettingsHoverIcon from '@ringcentral-integration/widgets/assets/images/SettingsHover.svg';

import DialPadIcon from '@ringcentral-integration/widgets/assets/images/DialPadNav.svg';
import DialPadHoverIcon from '@ringcentral-integration/widgets/assets/images/DialPadHover.svg';

import MessageIcon from '@ringcentral-integration/widgets/assets/images/Messages.svg';
import MessageHoverIcon from '@ringcentral-integration/widgets/assets/images/MessagesHover.svg';

const TABS = [
  {
    icon: DialPadIcon,
    activeIcon: DialPadHoverIcon,
    label: 'Dial Pad',
    path: '/dialer',
  },
  {
    icon: HistoryIcon,
    activeIcon: HistoryHoverIcon,
    label: 'History',
    path: '/history',
  },
  {
    icon: MessageIcon,
    activeIcon: MessageHoverIcon,
    label: 'Messages',
    path: '/messages',
    noticeCounts: 0,
    isActive: currentPath => (
      currentPath === '/messages' || currentPath.indexOf('/conversations/') !== -1
    ),
  },
  {
    icon: SettingsIcon,
    activeIcon: SettingsHoverIcon,
    label: 'Settings',
    path: '/settings',
    isActive: currentPath => (
      currentPath.substr(0, 9) === '/settings'
    ),
  },
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
