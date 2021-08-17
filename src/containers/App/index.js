import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';

import PhoneProvider from '@ringcentral-integration/widgets/lib/PhoneProvider';
import CallingSettingsPage from '@ringcentral-integration/widgets/containers/CallingSettingsPage';
import RegionSettingsPage from '@ringcentral-integration/widgets/containers/RegionSettingsPage';
import SettingsPage from '@ringcentral-integration/widgets/containers/SettingsPage';
import LoginPage from '@ringcentral-integration/widgets/containers/LoginPage';

import CallHistoryPage from '@ringcentral-integration/widgets/containers/CallHistoryPage';

import { DialerAndCallsTabContainer } from '@ringcentral-integration/widgets/containers/DialerAndCallsTabContainer';
import ActiveCallsPage from '@ringcentral-integration/widgets/containers/ActiveCallsPage';
import DialerPage from '@ringcentral-integration/widgets/containers/DialerPage';

import AlertContainer from '@ringcentral-integration/widgets/containers/AlertContainer';
import ConnectivityBadgeContainer from '@ringcentral-integration/widgets/containers/ConnectivityBadgeContainer';

import ComposeTextPage from '@ringcentral-integration/widgets/containers/ComposeTextPage';
import ConversationsPage from '@ringcentral-integration/widgets/containers/ConversationsPage';
import { ConversationPage } from '@ringcentral-integration/widgets/containers/ConversationPage';

import { IncomingCallContainer } from '@ringcentral-integration/widgets/containers/IncomingCallContainer';
import CallCtrlPage from '@ringcentral-integration/widgets/containers/CallCtrlPage';
import TransferPage from '@ringcentral-integration/widgets/containers/TransferPage';
import FlipPage from '@ringcentral-integration/widgets/containers/FlipPage';
import CallBadgeContainer from '@ringcentral-integration/widgets/containers/CallBadgeContainer';
import AudioSettingsPage from '@ringcentral-integration/widgets/containers/AudioSettingsPage';

import MainView from '../MainView';
import AppView from '../AppView';

export default function App({
  phone,
  hostingUrl,
}) {
  return (
    <PhoneProvider phone={phone}>
      <Provider store={phone.store} >
        <Router history={phone.routerInteraction.history} >
          <Route
            component={routerProps => (
              <AppView
                hostingUrl={hostingUrl}
              >
                {routerProps.children}
                <ConnectivityBadgeContainer />
                <CallBadgeContainer
                  defaultOffsetX={0}
                  defaultOffsetY={45}
                  hidden={routerProps.location.pathname.indexOf('/calls/active') > -1}
                  goToCallCtrl={(sessionId) => {
                    phone.routerInteraction.push(`/calls/active/${sessionId}`);
                  }}
                />
                <IncomingCallContainer
                  showContactDisplayPlaceholder={false}
                  getAvatarUrl={
                    async (contact) => {
                      const avatarUrl = await phone.contacts.getProfileImage(contact);
                      return avatarUrl;
                    }
                  }
                >
                  <AlertContainer
                    callingSettingsUrl="/settings/calling"
                    regionSettingsUrl="/settings/region"
                  />
                </IncomingCallContainer>
              </AppView>
            )} >
            <Route
              path="/"
              component={() => (
                <LoginPage>
                  <AlertContainer
                    callingSettingsUrl="/settings/calling"
                    regionSettingsUrl="/settings/region"
                  />
                </LoginPage>
              )}
            />
            <Route
              path="/"
              component={routerProps => (
                <MainView>
                  {routerProps.children}
                  <AlertContainer
                    callingSettingsUrl="/settings/calling"
                    regionSettingsUrl="/settings/region"
                  />
                </MainView>
              )} >
              <Route
                path="/settings"
                component={routerProps => (
                  <SettingsPage
                    params={routerProps.location.query}
                    regionSettingsUrl="/settings/region"
                    callingSettingsUrl="/settings/calling"
                    showAudio
                    showFeedback={false}
                    showUserGuide={false}
                  />
                )}
              />
              <Route
                path="/settings/region"
                component={RegionSettingsPage}
              />
              <Route
                path="/settings/calling"
                component={CallingSettingsPage}
              />
              <Route
                path="/settings/audio"
                component={AudioSettingsPage}
              />
              <Route
                path="/calls"
                component={() => (
                  <DialerAndCallsTabContainer>
                    <ActiveCallsPage
                      onCallsEmpty={() => {
                        phone.routerInteraction.push('/dialer');
                      }}
                      useV2
                      getAvatarUrl={async (contact) => {
                        const avatarUrl = await phone.contacts.getProfileImage(contact);
                        return avatarUrl;
                      }}
                    />
                  </DialerAndCallsTabContainer>
                )}
              />
              <Route
                path="/history"
                component={() => (
                  <CallHistoryPage
                    showContactDisplayPlaceholder={false}
                  />
                )}
              />
              <Route
                path="/settings/calling"
                component={CallingSettingsPage}
              />
              <Route
                path="/dialer"
                component={() => (
                  <DialerAndCallsTabContainer>
                    {
                      ({ showTabs }) => (
                        <DialerPage
                          withTabs={showTabs}
                        />
                      )
                    }
                  </DialerAndCallsTabContainer>
                )}
              />
              <Route
                path="/composeText"
                component={ComposeTextPage}
              />
              <Route
                path="/conversations/:conversationId"
                component={routerProps => (
                  <ConversationPage
                    params={routerProps.params}
                    showContactDisplayPlaceholder={false}
                    showGroupNumberName
                  />
                )}
              />
              <Route
                path="/messages"
                component={() => (
                  <ConversationsPage
                    showContactDisplayPlaceholder={false}
                    showGroupNumberName
                  />
                )} />
              <Route
                path="/calls/active(/:sessionId)"
                component={routerProps => (
                  <CallCtrlPage
                    params={routerProps.params}
                    showContactDisplayPlaceholder={false}
                    onAdd={() => {
                      phone.routerInteraction.push('/dialer');
                    }}
                    onBackButtonClick={() => {
                      phone.routerInteraction.push('/calls');
                    }}
                    getAvatarUrl={
                      async (contact) => {
                        const avatarUrl = await phone.contacts.getProfileImage(contact);
                        return avatarUrl;
                      }
                    }
                  />
                )}
              />
              <Route
                path="/transfer/:sessionId(/:type)"
                component={routerProps => (
                  <TransferPage params={routerProps.params} />
                )}
              />
              <Route
                path="/flip/:sessionId"
                component={(routerProps) => (
                  <FlipPage params={routerProps.params} />
                )}
              />
            </Route>
          </Route>
        </Router>
      </Provider>
    </PhoneProvider>
  );
}

App.propTypes = {
  phone: PropTypes.object.isRequired,
  hostingUrl: PropTypes.string.isRequired,
};
