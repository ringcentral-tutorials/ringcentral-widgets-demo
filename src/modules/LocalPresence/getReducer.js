import { combineReducers } from 'redux';
import getModuleStatusReducer from '@ringcentral-integration/commons/lib/getModuleStatusReducer';

export function getCustomizeDataReducer(types) {
  return (state = null, { type, data }) => {
    switch (type) {
      case types.saveCustomizeData:
        return data;
      default:
        return state;
    }
  };
}

export function getPersonalCustomizeDataReducer(types) {
  return (state = null, { type, data }) => {
    switch (type) {
      case types.savePersonalCustomizeData:
        return data;
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
