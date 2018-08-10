import { combineReducers } from 'redux';
import getModuleStatusReducer from 'ringcentral-integration/lib/getModuleStatusReducer';

export function getAPIKeyReducer(types) {
  return (state = null, { type, key }) => {
    switch (type) {
      case types.updateAPIKey:
        return key;
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
