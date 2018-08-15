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

export default function getReducer(types) {
  return combineReducers({
    status: getModuleStatusReducer(types),
  });
}
