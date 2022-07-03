import appStore from 'store/index';

import { TOGGLE, ACCEPT, REJECT, ONHIDE, CUSTOM } from 'store/actions/type/confirmDialog';

const initialState = {
  message: 'Are you sure you want to proceed?',
  header: 'Confirmation',
  icon: 'pi pi-exclamation-triangle',
  visible: false,
  onHide: () => {
    appStore.dispatch({ type: TOGGLE, payload: false });
  }
};

const confirmDialogDetails = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE:
      return {
        ...initialState, visible: action.payload

      };
    case ACCEPT:
      return {
        ...state, accept: action.payload
      };
    case REJECT:
      return {
        ...state, reject: action.payload
      };
    case ONHIDE:
      return {
        ...state, onHide: () => {
          appStore.dispatch({ type: "TOGGLE", payload: false });
          action.payload()
        }
      };
    case CUSTOM:
      return {
        ...state , ...action.payload 
      };
    default:
      return { ...state };
  }
};

export {
  confirmDialogDetails
}