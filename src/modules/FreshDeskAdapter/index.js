import RcModule from 'ringcentral-integration/lib/RcModule';
import { Module } from 'ringcentral-integration/lib/di';


import getReducer, { getAPIKeyReducer, getBaseUriReducer } from './getReducer';
import actionTypes from './actionTypes';
import * as freshDeskClient from './freshDeskClient';

@Module({
  deps: [
    { dep: 'Subscription' },
    { dep: 'GlobalStorage' },
    { dep: 'FreshDeskAdapterOptions', optional: true, spread: true },
  ],
})
export default class FreshDeskAdapter extends RcModule {
  constructor({
    subscription,
    globalStorage,
    ...options,
  }) {
    super({
      actionTypes,
      ...options,
    });

    this._subscription = subscription;
    this._globalStorage = globalStorage;
    this._reducer = getReducer(this.actionTypes);

    this._globalStorageAPIKey = 'freshDeskAdapterAPIKey';
    this._globalStorageBaseURI = 'freshDeskAdapterBaseUri';

    // register redux into global storage module
    // global storage module will map redux data into localstorage
    this._globalStorage.registerReducer({
      key: this._globalStorageAPIKey,
      reducer: getAPIKeyReducer(this.actionTypes),
    });

    this._globalStorage.registerReducer({
      key: this._globalStorageBaseURI,
      reducer: getBaseUriReducer(this.actionTypes),
    });

    this._lastSubscriptionMessage = null;
    this._lastSubscriptionSequence = 0;
    this._pendingTickets = {};
  }

  // on redux state change, to interact with other modules
  async _onStateChange() {
    if (this._shouldInit()) {
      this.store.dispatch({
        type: this.actionTypes.init,
      });
      await this._subscription.subscribe('/account/~/extension/~/presence?detailedTelephonyState=true&sipData=true');
      this.store.dispatch({
        type: this.actionTypes.initSuccess
      });
    } else if (this._shouldReset()) {
      this.store.dispatch({
        type: this.actionTypes.resetSuccess,
      });
    } else if (
      this.ready &&
      this._subscription.ready &&
      this._subscription.message &&
      this._subscription.message !== this._lastSubscriptionMessage
    ) {
      this._lastSubscriptionMessage = this._subscription.message;
      this._subscriptionHandler(this._lastSubscriptionMessage);
    }
  }

  // should init when dependences ready
  _shouldInit() {
    return (
      this._subscription.ready &&
      this.pending
    );
  }

  // should init when dependences not ready
  _shouldReset() {
    return (
      (
        !this._subscription.ready
      ) &&
      this.ready
    );
  }

  // server notification handler when get presence event
  _subscriptionHandler(message) {
    if (
      message &&
      message.event.indexOf('presence?detailedTelephonyState=true&sipData=true') > -1 &&
      message.body
    ) {
      if (message.body.sequence) {
        if (message.body.sequence <= this._lastSubscriptionSequence) {
          return;
        }
        this._lastSubscriptionSequence = message.body.sequence;
      }
      if (message.body && message.body.activeCalls) {
        message.body.activeCalls.forEach((call) => {
          this._callHandler(call);
        });
      }
    }
  }

  // handle call
  // call duration only can be got by call log api. So we use Date.now as answeredTime and endedTime
  // duration = endedTime - answeredTime
  async _callHandler(call) {
    if (call.direction !== 'Inbound') {
      return;
    }
    if (!this.apiKey) {
      return;
    }
    // create ticket on Call answered
    if (call.telephonyStatus === 'CallConnected' && !this._pendingTickets[call.sessionId]) {
      const answeredCall = {
        ...call,
        answeredTime: Date.now()
      };
      this._pendingTickets[call.sessionId] = answeredCall;
      try {
        const ticket = await freshDeskClient.createTicket(this.apiKey, this.baseUri, answeredCall);
        this._pendingTickets[call.sessionId].ticketId = ticket.id;
        // open ticket window in here
      } catch (e) {
        if (e.status === 401) {
          this.updateAPIKey(null);
        }
      }
    }
    // update ticket on Call Ended
    if (call.telephonyStatus === 'NoCall' && this._pendingTickets[call.sessionId]) {
      const endedCall = {
        ...call,
        endedTime: Date.now()
      };
      const pendingCall = this._pendingTickets[call.sessionId];
      try {
        await freshDeskClient.updateTicket(this.apiKey, this.baseUri, pendingCall.ticketId, endedCall);
      } catch (e) {
        if (e.status === 401) {
          this.updateAPIKey(null);
        }
      }
      delete this._pendingTickets[call.sessionId];
    }
  }

  // save api key to redux store, global storage module will map it into localstorage
  updateSettings(key, baseUri) {
    this.store.dispatch({
      type: this.actionTypes.updateSettings,
      key,
      baseUri,
    });
  }

  get status() {
    return this.state.status;
  }

  get apiKey() {
    return this._globalStorage.getItem(this._globalStorageAPIKey);
  }

  get baseUri() {
    return this._globalStorage.getItem(this._globalStorageBaseURI);
  }
}
