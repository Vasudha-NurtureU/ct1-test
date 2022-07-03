import { combineReducers } from "redux";
import { appDetails } from "./app";
import { loginDetails } from "./login";
import { toasterDetails } from "./toaster";
import { confirmDialogDetails } from "./confirmDialog";
import { modalPopupDetails } from "./modalPopup";
import { dropdownDetails } from "./dropdown";
import { galleryPopupDetails } from "./galleryPopup";

const rootReducer = combineReducers({
  appDetails,
  loginDetails,
  toasterDetails,
  confirmDialogDetails,
  modalPopupDetails,
  dropdownDetails,
  galleryPopupDetails
});

export default rootReducer;