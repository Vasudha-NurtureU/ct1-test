
import { ax } from 'services/base';

export default class HelpService {

  getHelpList(payload) {
    return ax.post('cmspage-list', payload)
  }

  getHelp(id) {
    return ax.get(`cmspage/${id}`)
  }

  addHelp(payload) {
    return ax.post(`cmspage`, payload)
  }

  updateHelp(id, payload) {
    return ax.put(`cmspage/${id}`, payload)
  }

  removeHelp(id) {
    return ax.delete(`cmspage/${id}`)
  }

}