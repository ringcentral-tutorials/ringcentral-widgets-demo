import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';

import PhoneProvider from 'ringcentral-widgets/lib/PhoneProvider';
import CallingSettingsPage from 'ringcentral-widgets/containers/CallingSettingsPage';
import RegionSettingsPage from 'ringcentral-widgets/containers/RegionSettingsPage';
import DialerPage from 'ringcentral-widgets/containers/DialerPage';
import SettingsPage from 'ringcentral-widgets/containers/SettingsPage';
import WelcomePage from 'ringcentral-widgets/containers/WelcomePage';
import ActiveCallsPage from 'ringcentral-widgets/containers/ActiveCallsPage';
import CallHistoryPage from 'ringcentral-widgets/containers/CallHistoryPage';
import DialerAndCallsTabContainer from 'ringcentral-widgets/containers/DialerAndCallsTabContainer';

import AlertContainer from 'ringcentral-widgets/containers/AlertContainer';

import ComposeTextPage from 'ringcentral-widgets/containers/ComposeTextPage';
import ConversationsPage from 'ringcentral-widgets/containers/ConversationsPage';
import ConversationPage from 'ringcentral-widgets/containers/ConversationPage';

import ConferencePage from 'ringcentral-widgets/containers/ConferencePage';
import ConferenceCommands from 'ringcentral-widgets/components/ConferenceCommands';

import IncomingCallPage from 'ringcentral-widgets/containers/IncomingCallPage';
import CallCtrlPage from 'ringcentral-widgets/containers/CallCtrlPage';
import TransferPage from 'ringcentral-widgets/containers/TransferPage';
import CallBadgeContainer from 'ringcentral-widgets/containers/CallBadgeContainer';
import AudioSettingsPage from 'ringcentral-widgets/containers/AudioSettingsPage';

import MainView from '../MainView';
import AppView from '../AppView';
import ThirdPartyConferenceInviteButton from '../../components/ThirdPartyConferenceInviteButton';

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
                <CallBadgeContainer
                  defaultOffsetX={0}
                  defaultOffsetY={45}
                  hidden={routerProps.location.pathname.indexOf('/calls/active') > -1}
                  goToCallCtrl={() => {
                    phone.routerInteraction.push('/calls/active');
                  }}
                />
                <IncomingCallPage
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
                </IncomingCallPage>
              </AppView>
            )} >
            <Route
              path="/"
              component={() => (
                <WelcomePage>
                  <AlertContainer
                    callingSettingsUrl="/settings/calling"
                    regionSettingsUrl="/settings/region"
                  />
                </WelcomePage>
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
                path="/conference/commands"
                component={() => (
                  <ConferenceCommands
                    currentLocale={phone.locale.currentLocale}
                    onBack={() => phone.routerInteraction.goBack()} />
                )}
              />
              <Route
                path="/conference"
                component={
                  () => (
                    <ConferencePage
                      additionalButtons={[ThirdPartyConferenceInviteButton]}
                    />
                  )
                }
              />
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
