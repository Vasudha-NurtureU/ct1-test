import appStore from 'store/index';

import { SUCCESS, INFO, WARN, ERROR, CUSTOM } from 'store/actions/type/toaster';

const toaster = {

  success: (detail) => {
    appStore.dispatch({
      type: SUCCESS, payload: { toastMessage: { severity: "success", summary: 'Success', detail: detail } }
    });
  },

  info: (detail) => {
    appStore.dispatch({
      type: INFO, payload: { toastMessage: { severity: "info", summary: 'Information', detail: detail } }
    });
  },

  warn: (detail) => {
    appStore.dispatch({
      type: WARN, payload: { toastMessage: { severity: "warn", summary: 'Warning', detail: detail } }
    });
  },

  error: (detail) => {
    appStore.dispatch({
      type: ERROR, payload: { toastMessage: { severity: "error", summary: 'Error', detail: detail } }
    });
  },

  custom: (toastMessage) => {
    appStore.dispatch({
      type: CUSTOM, payload: { toastMessage: toastMessage }
    });
  },

}

export {
  toaster
}