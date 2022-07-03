import appStore from 'store/index';

import { TOGGLE, ACCEPT, REJECT, ONHIDE, CUSTOM } from 'store/actions/type/confirmDialog';

const confirmDialog = {

  toggle: (bool) => {
    appStore.dispatch({
      type: TOGGLE, payload: bool
    });
  },

  accept: (cb) => {
    appStore.dispatch({
      type: ACCEPT, payload: cb
    });
  },

  reject: (cb) => {
    appStore.dispatch({
      type: REJECT, payload: cb
    });
  },

  onHide: (cb) => {
    appStore.dispatch({
      type: ONHIDE, payload: cb
    });
  },

  custom: (confirmDialogOptions) => {
    appStore.dispatch({
      type: CUSTOM, payload: confirmDialogOptions
    });
  },

}

export {
  confirmDialog
}