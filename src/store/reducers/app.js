import { OPENSIDEBAR } from "store/actions/type/app";

import { UPDATEBREADCRUMB } from "store/actions/type/app";

let appState = {
  isSidebarOpen: (window.screen.width > 767) ? false : true,
  breadcrumb: [],
};

export const appDetails = (state = appState, action) => {
  switch (action.type) {
    case OPENSIDEBAR:
      return {
        ...state,
        isSidebarOpen: action.payload,
      };
    case UPDATEBREADCRUMB:
      return {
        ...state,
        breadcrumb: action.payload,
      };
    default:
      return state;
  }
};
