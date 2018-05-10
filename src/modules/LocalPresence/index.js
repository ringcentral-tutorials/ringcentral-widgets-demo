import RcModule from 'ringcentral-integration/lib/RcModule';
import { Module } from 'ringcentral-integration/lib/di';


import getReducer from './getReducer';
import actionTypes from './actionTypes';


@Module({
  deps: [
    { dep: 'DetailedPresence' },
    { dep: 'LocalPresenceOptions', optional: true, spread: true },
  ],
})
export default class LocalPresence extends RcModule {
  constructor({
    detailedPresence,
    ...options,
  }) {
    super({
      actionTypes,
      ...options,
    });

    this._detailedPresence = detailedPresence;

    this._reducer = getReducer(this.actionTypes);

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
  }

  _shouldInit() {
    return (
      this._detailedPresence.ready &&
      this.pending
    );
  }

  _shouldReset() {
    return (
      (
        !this._detailedPresence.ready
      ) &&
      this.ready
    );
  }

  get status() {
    return this.state.status;
  }


}
