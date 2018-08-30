import RcModule from 'ringcentral-integration/lib/RcModule';
import { Module } from 'ringcentral-integration/lib/di';


import getReducer, { getAPIKeyReducer, getBaseUriReducer, getPendingTicketsReducer } from './getReducer';
import actionTypes from './actionTypes';
import * as freshDeskClient from './freshDeskClient';

@Module({
  deps: [
    { dep: 'Subscription' },
    { dep: 'GlobalStorage' },
    { dep: 'Storage' },
    { dep: 'TabManager' },
    { dep: 'FreshDeskAdapterOptions', optional: true, spread: true },
  ],
})
export default class FreshDeskAdapter extends RcModule {
  constructor({
    subscription,
    globalStorage,
    storage,
    tabManager,
    ...options,
  }) {
    super({
      actionTypes,
      ...options,
    });

    this._subscription = subscription;
    this._globalStorage = globalStorage;
    this._storage = storage;
    this._tabManager = tabManager
    this._reducer = getReducer(this.actionTypes);

    this._globalStorageAPIKey = 'freshDeskAdapterAPIKey';
    this._globalStorageBaseURI = 'freshDeskAdapterBaseUri';
    this._globalStoragePendingTicketKey = 'freshDeskAdapterPendingTicketKey';

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

    this._storage.registerReducer({
      key: this._globalStoragePendingTicketKey,
      reducer: getPendingTicketsReducer(this.actionTypes),
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
      this._tabManager.ready &&
      this._globalStorage.ready &&
      this.pending
    );
  }

  // should init when dependences not ready
  _shouldReset() {
    return (
      (
        !this._subscription.ready ||
        !this._tabManager.ready ||
        !this._globalStorage.ready
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
    if (!this._tabManager.active) {
      return;
    }
    // create ticket on Call answered
    if (call.telephonyStatus === 'CallConnected' && !this.pendingTickets[call.sessionId]) {
      const answeredCall = {
        ...call,
        answeredTime: Date.now()
      };
      this.store.dispatch({
        type: this.actionTypes.createTicket,
        sessionId: call.sessionId,
        ticket: { sessionId: call.sessionId, answeredTime: answeredCall.answeredTime },
      });
      try {
        const ticket = await freshDeskClient.createTicket(this.apiKey, this.baseUri, answeredCall);
        this.store.dispatch({
          type: this.actionTypes.createTicketSuccess,
          sessionId: call.sessionId,
          ticket: { ticketId: ticket.id },
        });
      } catch (e) {
        if (e.status === 401) {
          this.updateAPIKey(null);
        }
        this.store.dispatch({
          type: this.actionTypes.createTicketError,
          sessionId: call.sessionId
        });
      }
    }
    // update ticket on Call Ended
    if (call.telephonyStatus === 'NoCall' && this.pendingTickets[call.sessionId]) {
      const pendingCall = this.pendingTickets[call.sessionId];
      const endedCall = {
        ...call,
        answeredTime: pendingCall.answeredTime,
        endedTime: Date.now()
      };
      this.store.dispatch({
        type: this.actionTypes.updateTicketSuccess,
        sessionId: call.sessionId
      });
      try {
        await freshDeskClient.updateTicket(this.apiKey, this.baseUri, pendingCall.ticketId, endedCall);
      } catch (e) {
        if (e.status === 401) {
          this.updateAPIKey(null);
        }
      }
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

  get pendingTickets() {
    return this._storage.getItem(this._globalStoragePendingTicketKey);
  }
}
