import moduleStatuses from 'ringcentral-integration/enums/moduleStatuses';
import ensureExist from 'ringcentral-integration/lib/ensureExist';
import { Module } from 'ringcentral-integration/lib/di';

import AdapterModuleCore from 'ringcentral-widgets/lib/AdapterModuleCore';

import messageTypes from '../../lib/Adapter/messageTypes';
import actionTypes from './actionTypes';
import getReducer from './getReducer';

@Module({
  name: 'Adapter',
  deps: [
    'Auth',
    'Locale',
    'DetailedPresence',
    'RouterInteraction',
    'CallingSettings',
    'GlobalStorage',
    'Storage',
    'Webphone',
    { dep: 'AdapterOptions', optional: true }
  ]
})
export default class Adapter extends AdapterModuleCore {
  constructor({
    auth,
    detailedPresence,
    prefix,
    ...options,
  }) {
    super({
      ...options,
      prefix,
      actionTypes,
      messageTypes,
      presence: detailedPresence,
      storageKey: 'adapterData',
    });
    this._auth = this::ensureExist(auth, 'auth');
    this._messageTypes = messageTypes;
    this._presence = this::ensureExist(detailedPresence, 'detailedPresence');
    this._reducer = getReducer(this.actionTypes);
  }

  initialize() {
    window.addEventListener('message', event => this._onMessage(event));
    this.store.subscribe(() => this._onStateChange());
  }

  _onStateChange() {
    if (this._shouldInit()) {
      this.store.dispatch({
        type: this.actionTypes.init,
      });
      this._pushAdapterState();
      this.store.dispatch({
        type: this.actionTypes.initSuccess,
      });
    }
    this._pushPresence();
    this._pushLocale();
  }

  _pushAdapterState() {
    this._postMessage({
      type: this._messageTypes.pushAdapterState,
      size: this.size,
      minimized: this.minimized,
      closed: this.closed,
      position: this.position,
      telephonyStatus: (this._auth.loggedIn && this._presence.telephonyStatus) || null,
      userStatus: (this._auth.loggedIn && this._presence.userStatus) || null,
      dndStatus: (this._auth.loggedIn && this._presence.dndStatus) || null,
    });
  }

  _pushPresence() {
    if (
      this.ready &&
      (
        this._lastDndStatus !== this._presence.dndStatus ||
        this._lastUserStatus !== this._presence.userStatus ||
        this._lastTelephonyStatus !== this._presence.telephonyStatus
      )
    ) {
      this._lastDndStatus = this._presence.dndStatus;
      this._lastUserStatus = this._presence.userStatus;
      this._lastTelephonyStatus = this._presence.telephonyStatus;
      this._postMessage({
        type: this._messageTypes.syncPresence,
        telephonyStatus: (this._auth.loggedIn && this._presence.telephonyStatus) || null,
        userStatus: (this._auth.loggedIn && this._presence.userStatus) || null,
        dndStatus: (this._auth.loggedIn && this._presence.dndStatus) || null,
      });
    }
  }

  // eslint-disable-next-line
  _postMessage(data) {
    if (window && window.parent) {
      window.parent.postMessage(data, '*');
    }
  }

  get ready() {
    return this.state.status === moduleStatuses.ready;
  }

  get pending() {
    return this.state.status === moduleStatuses.pending;
  }
}
