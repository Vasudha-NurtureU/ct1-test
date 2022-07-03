import { TOGGLE, LINKCOPY, ATTACHCOPY, HIDE, CUSTOM } from 'store/actions/type/galleryPopup';

const initialState = {
  visible: false,
  onLinkCopy: () => {},
  onAttachmentCopy: () => {},
  onHide: () => {},
};

const galleryPopupDetails = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE:
      return {
        ...state, visible: action.payload
      };
    case LINKCOPY:
      return {
        ...state, onLinkCopy: () => { action.payload() }
      };
    case ATTACHCOPY:
      return {
        ...state, onAttachmentCopy: () => { action.payload() }
      };
    case HIDE:
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
  galleryPopupDetails
}