import { ax } from 'services/base'


const config = {
  headers: { 'content-type': 'multipart/form-data' } // to send the file 
}
export default class LoginService {

  login(payload) {
    return ax.post(`user/authenticate`, payload)
  }

  ssoLogin(payload) {
    return ax.post(`user/ssoauthenticate`, payload)
  }

  register(payload) {
    return ax.post('user', payload, config)
  }

  forgetPassword(payload) {
    return ax.post(`user/forgotpassword`, payload)
  }

  resetPassword(payload) {
    return ax.post(`user/resetpassword`, payload)
  }

}