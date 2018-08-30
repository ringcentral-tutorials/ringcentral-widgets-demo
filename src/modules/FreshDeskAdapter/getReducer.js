import { combineReducers } from 'redux';
import getModuleStatusReducer from 'ringcentral-integration/lib/getModuleStatusReducer';

export function getAPIKeyReducer(types) {
  return (state = null, { type, key }) => {
    switch (type) {
      case types.updateSettings:
        return key;
      default:
        return state;
    }
  };
}

export function getBaseUriReducer(types) {
  return (state = null, { type, baseUri }) => {
    switch (type) {
      case types.updateSettings:
        return baseUri;
      default:
        return state;
    }
  };
}

export function getPendingTicketsReducer(types) {
  return (state = {}, { type, sessionId, ticket }) => {
    let newState;
    let oldTicket;
    switch (type) {
      case types.createTicket:
        return {
          ...state,
          [sessionId]: ticket
        };
      case types.createTicketSuccess:
        oldTicket = state[sessionId] || {};
        return {
          ...state,
          [sessionId]: {
            ...oldTicket,
            ...ticket,
          }
        };
      case types.createTicketError:
      case types.updateTicketSuccess:
        newState = {
          ...state,
        };
        delete newState[sessionId];
        return newState;
      case types.resetSuccess:
        return {};
      default:
        return state;
    }
  };
}

export default function getReducer(types) {
  return combineReducers({
    status: getModuleStatusReducer(types),
  });
}
