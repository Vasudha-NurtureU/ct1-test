
import { LOGIN, SIGNUP, LOGOUT, SHOWLOGIN } from "../actions/type/login";

import { lStorage } from 'utils/storage';

let loginState = {
  login: (lStorage.get('authInfo')) ? lStorage.get('authInfo') : {
    id      : null ,
    isUser  : false,
    userRole: null ,
    name    : null ,
    email   : null ,
    avatar  : null ,
  },
  signup: {
    signupMessage: 'React Signup'
  },
  expired: false
}

export const loginDetails = (state = loginState, action) => {

  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        login: action.payload,
      }
    case SIGNUP:
      return { ...state, signup: action.payload }
    case LOGOUT:
      return {
        ...state,
        expired: true
      }
    case SHOWLOGIN:
      return {
        ...state,
        login: {
          id      : null ,
          isUser  : false,
          userRole: null ,
          name    : null ,
          email   : null ,
          avatar  : null ,
        },
        expired: false
      }
    default:
      return state;
  }

};