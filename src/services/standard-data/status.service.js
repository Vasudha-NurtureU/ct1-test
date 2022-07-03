
import { ax } from 'services/base'

export default class StatusService {

  getStatusList(params) {
    return ax.get('status',{ params: params })
  }

  getStatus(id) {
    return ax.get(`status/${id}`)
  }

  addStatus(payload) {
    return ax.post(`status`, payload)
  }

  updateStatus(id, payload) {
    return ax.put(`status/${id}`, payload)
  }

  removeStatus(id) {
    return ax.delete(`status/${id}`)
  }

}
