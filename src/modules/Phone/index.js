import SDK from '@ringcentral/sdk';
import { RingCentralClient } from '@ringcentral-integration/commons/lib/RingCentralClient';

import { ModuleFactory } from '@ringcentral-integration/commons/lib/di';
import RcModule from '@ringcentral-integration/commons/lib/RcModule';
import { LocalForageStorage } from '@ringcentral-integration/commons/lib/LocalForageStorage';

import Alert from '@ringcentral-integration/commons/modules/Alert';
import Auth from '@ringcentral-integration/commons/modules/Auth';
import { Brand } from '@ringcentral-integration/commons/modules/Brand';
import { AppFeatures } from '@ringcentral-integration/commons/modules/AppFeatures';
import AccountInfo from '@ringcentral-integration/commons/modules/AccountInfo';
import ConnectivityMonitor from '@ringcentral-integration/commons/modules/ConnectivityMonitor';
import DateTimeFormat from '@ringcentral-integration/commons/modules/DateTimeFormat';
import { DataFetcherV2 } from '@ringcentral-integration/commons/modules/DataFetcherV2';
import DialingPlan from '@ringcentral-integration/commons/modules/DialingPlan';
import ExtensionInfo from '@ringcentral-integration/commons/modules/ExtensionInfo';
import Environment from '@ringcentral-integration/commons/modules/Environment';
import GlobalStorage from '@ringcentral-integration/commons/modules/GlobalStorage';
import { Locale } from '@ringcentral-integration/commons/modules/Locale';
import { ExtensionFeatures } from '@ringcentral-integration/commons/modules/ExtensionFeatures';
import RegionSettings from '@ringcentral-integration/commons/modules/RegionSettings';
import RateLimiter from '@ringcentral-integration/commons/modules/RateLimiter';
import Subscription from '@ringcentral-integration/commons/modules/Subscription';
import { AlertUI } from '@ringcentral-integration/widgets/modules/AlertUI';
import Storage from '@ringcentral-integration/commons/modules/Storage';
import { SleepDetector } from '@ringcentral-integration/commons/modules/SleepDetectorV2';
import { ConnectivityManager } from '@ringcentral-integration/widgets/modules/ConnectivityManager';

import CallLog from '@ringcentral-integration/commons/modules/CallLog';
import CallMonitor from '@ringcentral-integration/commons/modules/CallMonitor';
import CallHistory from '@ringcentral-integration/commons/modules/CallHistory';
import { CallHistoryUI } from '@ringcentral-integration/widgets/modules/CallHistoryUI';
import Presence from '@ringcentral-integration/commons/modules/Presence';
import ExtensionPhoneNumber from '@ringcentral-integration/commons/modules/ExtensionPhoneNumber';
import { ActiveCallsUI } from '@ringcentral-integration/widgets/modules/ActiveCallsUI';

import Call from '@ringcentral-integration/commons/modules/Call';
import { Softphone } from '@ringcentral-integration/commons/modules/Softphone';
import Ringout from '@ringcentral-integration/commons/modules/Ringout';
import NumberValidate from '@ringcentral-integration/commons/modules/NumberValidate';
import CallingSettings from '@ringcentral-integration/commons/modules/CallingSettings';
import AudioSettings from '@ringcentral-integration/commons/modules/AudioSettings';
import { AudioSettingsUI } from '@ringcentral-integration/widgets/modules/AudioSettingsUI';
import ForwardingNumber from '@ringcentral-integration/commons/modules/ForwardingNumber';
import DialerUI from '@ringcentral-integration/widgets/modules/DialerUI';
import { DialerAndCallsTabUI } from '@ringcentral-integration/widgets/modules/DialerAndCallsTabUI';
import { CallingSettingsUI } from '@ringcentral-integration/widgets/modules/CallingSettingsUI';

import OAuth from '@ringcentral-integration/widgets/modules/OAuth';
import RouterInteraction from '@ringcentral-integration/widgets/modules/RouterInteraction';
import ConnectivityBadgeUI from '@ringcentral-integration/widgets/modules/ConnectivityBadgeUI';
import { SettingsUI } from '@ringcentral-integration/widgets/modules/SettingsUI';
import RegionSettingsUI from '@ringcentral-integration/widgets/modules/RegionSettingsUI';
import LoginUI from '@ringcentral-integration/widgets/modules/LoginUI';

import MessageStore from '@ringcentral-integration/commons/modules/MessageStore';
import Conversations from '@ringcentral-integration/commons/modules/Conversations';
import { ConversationsUI } from '@ringcentral-integration/widgets/modules/ConversationsUI';
import { ConversationUI } from '@ringcentral-integration/widgets/modules/ConversationUI';
import MessageSender from '@ringcentral-integration/commons/modules/MessageSender';
import ComposeText from '@ringcentral-integration/commons/modules/ComposeText';
import { ComposeTextUI } from '@ringcentral-integration/widgets/modules/ComposeTextUI';

import Webphone from '@ringcentral-integration/commons/modules/Webphone';
import { CallBadgeUI } from '@ringcentral-integration/widgets/modules/CallBadgeUI';
import { IncomingCallUI } from '@ringcentral-integration/widgets/modules/IncomingCallUI';
import { CallControlUI } from '@ringcentral-integration/widgets/modules/CallControlUI';
import FlipUI from '@ringcentral-integration/widgets/modules/FlipUI';
import TransferUI from '@ringcentral-integration/widgets/modules/TransferUI';
import ExtensionDevice from '@ringcentral-integration/commons/modules/ExtensionDevice';
import AddressBook from '@ringcentral-integration/commons/modules/AddressBook';
import CompanyContacts from '@ringcentral-integration/commons/modules/CompanyContacts';
import AccountContacts from '@ringcentral-integration/commons/modules/AccountContacts';
import ContactMatcher from '@ringcentral-integration/commons/modules/ContactMatcher';
import Contacts from '@ringcentral-integration/commons/modules/Contacts';
import ContactSearch from '@ringcentral-integration/commons/modules/ContactSearch';
import LocalPresence from '../LocalPresence';
// user Dependency Injection with decorator to create a phone class
// https://github.com/ringcentral/ringcentral-js-integration-commons/blob/master/docs/dependency-injection.md
@ModuleFactory({
  providers: [
    { provide: 'Alert', useClass: Alert },
    { provide: 'AlertUI', useClass: AlertUI },
    { provide: 'RegionSettingsUI', useClass: RegionSettingsUI },
    { provide: 'Brand', useClass: Brand },
    { provide: 'Locale', useClass: Locale },
    { provide: 'DataFetcherV2', useClass: DataFetcherV2 },
    { provide: 'SleepDetector', useClass: SleepDetector },
    { provide: 'GlobalStorage', useClass: GlobalStorage },
    { provide: 'ConnectivityMonitor', useClass: ConnectivityMonitor },
    { provide: 'ConnectivityManager', useClass: ConnectivityManager },
    { provide: 'ConnectivityBadgeUI', useClass: ConnectivityBadgeUI },
    { provide: 'SettingsUI', useClass: SettingsUI },
    { provide: 'LoginUI', useClass: LoginUI },
    { provide: 'Auth', useClass: Auth },
    { provide: 'OAuth', useClass: OAuth },
    { provide: 'Storage', useClass: Storage },
    {
      provide: 'StorageOptions',
      useValue: {
        StorageProvider: LocalForageStorage, // IndexedDB
        disableInactiveTabsWrite: true,
      },
      spread: true,
    },
    { provide: 'RateLimiter', useClass: RateLimiter },
    { provide: 'Subscription', useClass: Subscription },
    { provide: 'DateTimeFormat', useClass: DateTimeFormat },
    { provide: 'RouterInteraction', useClass: RouterInteraction },
    { provide: 'Auth', useClass: Auth },
    { provide: 'AccountInfo', useClass: AccountInfo },
    { provide: 'Environment', useClass: Environment },
    { provide: 'RegionSettings', useClass: RegionSettings },
    { provide: 'AppFeatures', useClass: AppFeatures },
    { provide: 'ExtensionInfo', useClass: ExtensionInfo },
    { provide: 'ExtensionFeatures', useClass: ExtensionFeatures },
    { provide: 'DialingPlan', useClass: DialingPlan },
    { provide: 'CallLog', useClass: CallLog },
    { provide: 'CallMonitor', useClass: CallMonitor },
    { provide: 'CallHistory', useClass: CallHistory },
    { provide: 'CallHistoryUI', useClass: CallHistoryUI },
    { provide: 'ActiveCallsUI', useClass: ActiveCallsUI },
    { provide: 'Presence', useClass: Presence },
    { provide: 'ExtensionPhoneNumber', useClass: ExtensionPhoneNumber },
    { provide: 'Call', useClass: Call },
    { provide: 'DialerUI', useClass: DialerUI },
    { provide: 'DialerAndCallsTabUI', useClass: DialerAndCallsTabUI },
    { provide: 'Softphone', useClass: Softphone },
    { provide: 'Ringout', useClass: Ringout },
    { provide: 'NumberValidate', useClass: NumberValidate },
    { provide: 'CallingSettings', useClass: CallingSettings },
    {
      provide: 'CallOptions',
      useValue: {
        permissionCheck: false,
      },
      spread: true,
    },
    {
      provide: 'CallingSettingsOptions',
      useValue: {
        emergencyCallAvailable: true,
        showCallWithJupiter: true,
      },
      spread: true,
    },
    { provide: 'CallingSettingsUI', useClass: CallingSettingsUI },
    { provide: 'AudioSettings', useClass: AudioSettings },
    { provide: 'AudioSettingsUI', useClass: AudioSettingsUI },
    { provide: 'ForwardingNumber', useClass: ForwardingNumber },
  
    { provide: 'LocalPresence', useClass: LocalPresence },

    { provide: 'MessageStore', useClass: MessageStore },
    { provide: 'Conversations', useClass: Conversations },
    { provide: 'ConversationUI', useClass: ConversationUI },
    { provide: 'ConversationsUI', useClass: ConversationsUI },
    { provide: 'MessageSender', useClass: MessageSender },
    { provide: 'ComposeText', useClass: ComposeText },
    { provide: 'ComposeTextUI', useClass: ComposeTextUI },
    {
      provide: 'EnvironmentOptions',
      useFactory: ({ sdkConfig }) => sdkConfig,
      deps: [
        { dep: 'SdkConfig' },
      ],
    },
    {
      provide: 'Client',
      useFactory: ({ sdkConfig }) =>
        new RingCentralClient(new SDK(sdkConfig)),
      deps: [
        { dep: 'SdkConfig', useParam: true, },
      ],
    },
    { provide: 'Webphone', useClass: Webphone },
    { provide: 'IncomingCallUI', useClass: IncomingCallUI },
    { provide: 'CallControlUI', useClass: CallControlUI },
    { provide: 'CallBadgeUI', useClass: CallBadgeUI },
    { provide: 'FlipUI', useClass: FlipUI },
    { provide: 'TransferUI', useClass: TransferUI },
    { provide: 'ExtensionDevice', useClass: ExtensionDevice },
    { provide: 'AccountContacts', useClass: AccountContacts },
    { provide: 'CompanyContacts', useClass: CompanyContacts },
    { provide: 'AddressBook', useClass: AddressBook },
    { provide: 'Contacts', useClass: Contacts },
    { provide: 'ContactMatcher', useClass: ContactMatcher },
    { provide: 'ContactSearch', useClass: ContactSearch },
    {
      provide: 'ContactSources',
      useFactory: ({ addressBook, accountContacts }) =>
        [addressBook, accountContacts],
      deps: ['AccountContacts', 'AddressBook']
    },
  ]
})
export default class BasePhone extends RcModule {
  constructor(options) {
    super(options);
    const {
      appConfig,
      webphone,
      routerInteraction,
      contactMatcher,
      contacts,
    } = options;
    this._appConfig = appConfig;

    webphone.onCallEnd((session) => {
      if (routerInteraction.currentPath.indexOf('/calls/active') === -1) {
        return;
      }
      const currentSession = webphone.activeSession;
      if (currentSession && session.id !== currentSession.id) {
        return;
      }
      routerInteraction.push('/calls');
    });
    webphone.onCallStart(() => {
      if (routerInteraction.currentPath.indexOf('/calls/active') > -1) {
        return;
      }
      routerInteraction.push('/calls/active');
    });
    webphone.onCallRing(() => {
      if (
        webphone.ringSessions.length > 1
      ) {
        if (routerInteraction.currentPath !== '/calls') {
          routerInteraction.push('/calls');
        }
        webphone.ringSessions.forEach((session) => {
          webphone.toggleMinimized(session.id);
        });
      }
    });

    // ContactMatcher configuration
    contactMatcher.addSearchProvider({
      name: 'contacts',
      async searchFn({ queries }) {
        const items = await contacts.matchContacts({ phoneNumbers: queries });
        return items;
      },
      readyCheckFn() {
        return contacts.ready;
      },
    });
  }

  initialize() {
    this.store.subscribe(() => {
      if (this.auth.ready) {
        if (
          this.routerInteraction.currentPath !== '/' &&
          !this.auth.loggedIn
        ) {
          this.routerInteraction.push('/');
        } else if (
          this.routerInteraction.currentPath === '/' &&
          this.auth.loggedIn
        ) {
          if (this.dialerUI) {
            this.routerInteraction.push('/dialer');
            return;
          }
          this.routerInteraction.push('/settings');
        }
      }
    });
  }

  get name() {
    return this._appConfig.name;
  }

  get version() {
    return this._appConfig.version;
  }

  get _actionTypes() {
    return null;
  }
}

export function createPhone({
  prefix,
  apiConfig,
  brandConfig,
  appVersion,
  redirectUri,
}) {
  @ModuleFactory({
    providers: [
      { provide: 'ModuleOptions', useValue: { prefix }, spread: true },
      {
        provide: 'SdkConfig',
        useValue: {
          ...apiConfig,
          cachePrefix: `sdk-${prefix}`,
          clearCacheOnRefreshError: false,
        },
      },
      {
        provide: 'AppConfig',
        useValue: { name: brandConfig.appName, version: appVersion },
      },
      { provide: 'BrandConfig', useValue: brandConfig },
      { provide: 'OAuthOptions', useValue: { redirectUri }, spread: true },
      {
        provide: 'WebphoneOptions',
        useValue: {
          appKey: apiConfig.clientId,
          appName: brandConfig.appName,
          appVersion: appVersion,
          webphoneLogLevel: 3,
        },
        spread: true,
      },
    ]
  })
  class Phone extends BasePhone {}
  return Phone.create();
}
