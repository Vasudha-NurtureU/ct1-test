
import { ax } from "services/base";

export default class UserService {

  getUserList(payload) {
    return ax.post('user-list', payload)
  }

  getUser(id) {
    return ax.get(`user/${id}`)
  }

  addUser(payload) {
    return ax.post(`user`, payload)
  }

  updateUser(id, payload) {
    return ax.put(`user/${id}`, payload)
  }

  activateUser(params) {
    return ax.get(`user/activate`, { params: params })
  }

  removeUser(id) {
    return ax.delete(`user/${id}`)
  }

  updateUserProfile(id, payload) {
    return ax.post(`user/${id}`, payload)
  }

  getUserReport(payload) {
    return ax.post("userreport", payload);
  }

}
