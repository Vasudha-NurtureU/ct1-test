import { TOGGLE, ONHIDE, ONSHOW, CUSTOM } from 'store/actions/type/modalPopup';

const initialState = {
  header: 'ModalPopup',
  visible: false,
  className: 'sdm-popup',
  onHide: () => {

  }
};

const modalPopupDetails = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE:
      return {
        ...state,
        visible: action.payload,
        footer: null
      };
    case ONSHOW:
      return {
        ...state, onShow: () => { action.payload() }
      };
    case ONHIDE:
      return {
        ...state, onHide: () => { action.payload() }
      };
    case CUSTOM:
      return {
        ...state, ...action.payload
      };
    default:
      return { ...state };
  }
};

export {
  modalPopupDetails
}