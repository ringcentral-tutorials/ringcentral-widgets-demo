import React from 'react';
import { connect } from 'react-redux';

import withPhone from 'ringcentral-widgets/lib/withPhone';

import TabNavigationView from 'ringcentral-widgets/components/TabNavigationView';

import HistoryIcon from 'ringcentral-widgets/assets/images/CallHistory.svg';
import SettingsIcon from 'ringcentral-widgets/assets/images/Settings.svg';

import HistoryHoverIcon from 'ringcentral-widgets/assets/images/CallHistoryHover.svg';
import SettingsHoverIcon from 'ringcentral-widgets/assets/images/SettingsHover.svg';

import DialPadIcon from 'ringcentral-widgets/assets/images/DialPadNav.svg';
import DialPadHoverIcon from 'ringcentral-widgets/assets/images/DialPadHover.svg';

import MessageIcon from 'ringcentral-widgets/assets/images/Messages.svg';
import MessageHoverIcon from 'ringcentral-widgets/assets/images/MessagesHover.svg';

import ConferenceIcon from 'ringcentral-widgets/assets/images/Conference.svg';
import ConferenceHoverIcon from 'ringcentral-widgets/assets/images/ConferenceHover.svg';

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
    icon: ConferenceIcon,
    activeIcon: ConferenceHoverIcon,
    label: 'Schedule Conference',
    path: '/conference',
    isActive: currentPath => (
      currentPath.substr(0, 11) === '/conference'
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
