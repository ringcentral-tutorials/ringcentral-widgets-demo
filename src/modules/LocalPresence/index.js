import RcModule from 'ringcentral-integration/lib/RcModule';
import { Module } from 'ringcentral-integration/lib/di';


import getReducer, { getCustomizeDataReducer, getPersonalCustomizeDataReducer } from './getReducer';
import actionTypes from './actionTypes';


@Module({
  deps: [
    { dep: 'Presence' },
    { dep: 'GlobalStorage' },
    { dep: 'Storage' },
    { dep: 'LocalPresenceOptions', optional: true, spread: true },
  ],
})
export default class LocalPresence extends RcModule {
  constructor({
    presence,
    storage,
    globalStorage,
    ...options
  }) {
    super({
      actionTypes,
      ...options,
    });

    this._presence = presence;
    this._storage = storage;
    this._globalStorage = globalStorage;

    this._reducer = getReducer(this.actionTypes);

    this._globalStorageKey = 'localPresenceGlobalData';
    this._storageKey = 'localPresenceData';

    this._globalStorage.registerReducer({
      key: this._globalStorageKey,
      reducer: getCustomizeDataReducer(this.actionTypes),
    });
    this._storage.registerReducer({
      key: this._storageKey,
      reducer: getPersonalCustomizeDataReducer(this.actionTypes),
    });

    // your codes here
  }
  // your codes here

  // Codes on state change
  async _onStateChange() {
    if (this._shouldInit()) {
      this.store.dispatch({
        type: this.actionTypes.initSuccess
      });
    } else if (this._shouldReset()) {
      this.store.dispatch({
        type: this.actionTypes.resetSuccess,
      });
    }
    if (this.ready) {
      if (this._lastCalls !== this._presence.calls) {
        this._lastCalls = this._presence.calls;
        console.log(this._lastCalls);
      }
    }
  }

  _shouldInit() {
    return (
      this._presence.ready &&
      this.pending
    );
  }

  _shouldReset() {
    return (
      (
        !this._presence.ready
      ) &&
      this.ready
    );
  }

  updateCustomizeData(data) {
    this.store.dispatch({
      type: this.actionTypes.saveCustomizeData,
      data,
    });
  }

  updatePersonalCustomizeData(data) {
    this.store.dispatch({
      type: this.actionTypes.savePersonalCustomizeData,
      data,
    });
  }

  get status() {
    return this.state.status;
  }

  get customizeData() {
    return this._globalStorage.getItem(this._globalStorageKey);
  }

  get personalCustomizeData() {
    return this._storage.getItem(this._storageKey);
  }
}
