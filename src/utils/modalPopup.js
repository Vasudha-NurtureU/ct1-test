import appStore from 'store/index';

import { TOGGLE, ONHIDE, ONSHOW, CUSTOM } from 'store/actions/type/modalPopup';

const modalPopup = {

  toggle: (bool) => {
    appStore.dispatch({
      type: TOGGLE, payload: bool
    });
  },

  onHide: (cb) => {
    appStore.dispatch({
      type: ONHIDE, payload: cb
    });
  },

  onShow: (cb) => {
    appStore.dispatch({
      type: ONSHOW, payload: cb
    });
  },

  custom: (confirmDialogOptions) => {
    appStore.dispatch({
      type: CUSTOM, payload: confirmDialogOptions
    });
  },

}

export {
  modalPopup
}