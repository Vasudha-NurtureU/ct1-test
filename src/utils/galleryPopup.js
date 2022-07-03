import appStore from 'store/index';

import { TOGGLE, LINKCOPY, ATTACHCOPY, HIDE, CUSTOM } from 'store/actions/type/galleryPopup';

const galleryPopup = {

  toggle: (bool) => {
    appStore.dispatch({
      type: TOGGLE, payload: bool
    });
  },

  onLinkCopy: (cb) => {
    appStore.dispatch({
      type: LINKCOPY, payload: cb
    });
  },

  onAttachmentCopy: (cb) => {
    appStore.dispatch({
      type: ATTACHCOPY, payload: cb
    });
  },

  onHide: (cb) => {
    appStore.dispatch({
      type: HIDE, payload: cb
    });
  },

  custom: (dialogOptions) => {
    appStore.dispatch({
      type: CUSTOM, payload: dialogOptions
    });
  },

}

export {
  galleryPopup
}