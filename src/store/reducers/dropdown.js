import {
  STATUS,
  COUNTRY,
  TAGCATRGORIES,
  TAGS,
  DESTINATIONS,
  PACKAGES,
  CUSTOMERS,
  ASSETCATEGORRY,
  GENERALSTATUS,
  USERSTATUS,
  BOOKINGSTATUS,
  CLEAR,
  USERROLE,
} from 'store/actions/type/dropdown';

const initialState = {
  status: [],
  country: [],
  tagCategories: [],
  tags: [],
  destinations: [],
  packages: [],
  customers: [],
  assetCategory: [],
  generalStatus: [],
  bookingStatus: [],
  userStatus: [],
  roles: [],
  userRoleList: [],
};

const dropdownDetails = (state = initialState, action) => {
  switch (action.type) {
    case STATUS:
      return {
        ...state, status: action.payload
      };
    case COUNTRY:
      return {
        ...state, country: action.payload
      };
    case TAGCATRGORIES:
      return {
        ...state, tagCategories: action.payload
      };
    case TAGS:
      return {
        ...state, tags: action.payload
      };
    case DESTINATIONS:
      return {
        ...state, destinations: action.payload
      };
    case PACKAGES:
      return {
        ...state, packages: action.payload
      };
    case CUSTOMERS:
      return {
        ...state, customers: action.payload
      };
    case ASSETCATEGORRY:
      return {
        ...state, assetCategory: action.payload
      };
    case GENERALSTATUS:
      return {
        ...state, generalStatus: action.payload
      };
    case USERSTATUS:
      return {
        ...state, userStatus: action.payload
      };
    case BOOKINGSTATUS:
      return {
        ...state, bookingStatus: action.payload
      };
    case USERROLE:
      return {
        ...state, roles: action.payload
      };
    case CLEAR:
      return {
        ...state, ...initialState
      };
    default:
      return { ...state };
  }
};

export {
  dropdownDetails
}