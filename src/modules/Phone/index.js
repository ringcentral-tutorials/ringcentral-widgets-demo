import 'whatwg-fetch';
import SDK from 'ringcentral';
import RingCentralClient from 'ringcentral-client';

import { ModuleFactory } from 'ringcentral-integration/lib/di';
import RcModule from 'ringcentral-integration/lib/RcModule';

import Alert from 'ringcentral-integration/modules/Alert';
import Auth from 'ringcentral-integration/modules/Auth';
import Brand from 'ringcentral-integration/modules/Brand';
import AccountInfo from 'ringcentral-integration/modules/AccountInfo';
import ConnectivityMonitor from 'ringcentral-integration/modules/ConnectivityMonitor';
import DateTimeFormat from 'ringcentral-integration/modules/DateTimeFormat';
import DialingPlan from 'ringcentral-integration/modules/DialingPlan';
import ExtensionInfo from 'ringcentral-integration/modules/ExtensionInfo';
import Environment from 'ringcentral-integration/modules/Environment';
import GlobalStorage from 'ringcentral-integration/modules/GlobalStorage';
import Locale from 'ringcentral-integration/modules/Locale';
import RolesAndPermissions from 'ringcentral-integration/modules/RolesAndPermissions';
import RegionSettings from 'ringcentral-integration/modules/RegionSettings';
import RateLimiter from 'ringcentral-integration/modules/RateLimiter';
import Subscription from 'ringcentral-integration/modules/Subscription';
import Storage from 'ringcentral-integration/modules/Storage';

import CallLog from 'ringcentral-integration/modules/CallLog';
import CallMonitor from 'ringcentral-integration/modules/CallMonitor';
import CallHistory from 'ringcentral-integration/modules/CallHistory';
import DetailedPresence from 'ringcentral-integration/modules/DetailedPresence';

import Call from 'ringcentral-integration/modules/Call';
import Softphone from 'ringcentral-integration/modules/Softphone';
import Ringout from 'ringcentral-integration/modules/Ringout';
import NumberValidate from 'ringcentral-integration/modules/NumberValidate';
import CallingSettings from 'ringcentral-integration/modules/CallingSettings';
import AudioSettings from 'ringcentral-integration/modules/AudioSettings';
import AccountExtension from 'ringcentral-integration/modules/AccountExtension';
import ExtensionPhoneNumber from 'ringcentral-integration/modules/ExtensionPhoneNumber';
import ForwardingNumber from 'ringcentral-integration/modules/ForwardingNumber';
import DialerUI from 'ringcentral-widgets/modules/DialerUI';

import OAuth from 'ringcentral-widgets/modules/ProxyFrameOAuth';
import RouterInteraction from 'ringcentral-widgets/modules/RouterInteraction';


import MessageStore from 'ringcentral-integration/modules/MessageStore';
import Conversations from 'ringcentral-integration/modules/Conversations';
import MessageSender from 'ringcentral-integration/modules/MessageSender';
import ComposeText from 'ringcentral-integration/modules/ComposeText';
import ContactSearch from 'ringcentral-integration/modules/ContactSearch';

import Conference from 'ringcentral-integration/modules/Conference';

import LocalPresence from '../LocalPresence';
// user Dependency Injection with decorator to create a phone class
// https://github.com/ringcentral/ringcentral-js-integration-commons/blob/master/docs/dependency-injection.md
@ModuleFactory({
  providers: [
    { provide: 'Alert', useClass: Alert },
    { provide: 'Brand', useClass: Brand },
    { provide: 'Locale', useClass: Locale },
    { provide: 'GlobalStorage', useClass: GlobalStorage },
    { provide: 'ConnectivityMonitor', useClass: ConnectivityMonitor },
    { provide: 'Auth', useClass: Auth },
    { provide: 'OAuth', useClass: OAuth },
    { provide: 'Storage', useClass: Storage },
    { provide: 'RateLimiter', useClass: RateLimiter },
    { provide: 'Subscription', useClass: Subscription },
    { provide: 'DateTimeFormat', useClass: DateTimeFormat },
    { provide: 'RouterInteraction', useClass: RouterInteraction },
    { provide: 'Auth', useClass: Auth },
    { provide: 'AccountInfo', useClass: AccountInfo },
    { provide: 'Environment', useClass: Environment },
    { provide: 'RegionSettings', useClass: RegionSettings },
    { provide: 'RolesAndPermissions', useClass: RolesAndPermissions },
    { provide: 'ExtensionInfo', useClass: ExtensionInfo },
    { provide: 'DialingPlan', useClass: DialingPlan },
    { provide: 'CallLog', useClass: CallLog },
    { provide: 'CallMonitor', useClass: CallMonitor },
    { provide: 'CallHistory', useClass: CallHistory },
    { provide: 'DetailedPresence', useClass: DetailedPresence },
    { provide: 'Call', useClass: Call },
    { provide: 'DialerUI', useClass: DialerUI },
    { provide: 'Softphone', useClass: Softphone },
    { provide: 'Ringout', useClass: Ringout },
    { provide: 'NumberValidate', useClass: NumberValidate },
    { provide: 'CallingSettings', useClass: CallingSettings },
    { provide: 'AudioSettings', useClass: AudioSettings },
    { provide: 'AccountExtension', useClass: AccountExtension },
    { provide: 'ExtensionPhoneNumber', useClass: ExtensionPhoneNumber },
    { provide: 'ForwardingNumber', useClass: ForwardingNumber },
    { provide: 'LocalPresence', useClass: LocalPresence },
    { provide: 'MessageStore', useClass: MessageStore },

    { provide: 'Conversations', useClass: Conversations },
    { provide: 'MessageSender', useClass: MessageSender },
    { provide: 'ComposeText', useClass: ComposeText },
    { provide: 'ContactSearch', useClass: ContactSearch },
    { provide: 'Conference', useClass: Conference },
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
  ]
})
export default class BasePhone extends RcModule {
  constructor(options) {
    super(options);
    const {
      appConfig,
    } = options;
    this._appConfig = appConfig;
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
      { provide: 'BrandOptions', useValue: brandConfig, spread: true },
      { provide: 'OAuthOptions', useValue: { redirectUri }, spread: true },
    ]
  })
  class Phone extends BasePhone {}
  return Phone.create();
}
