
import { ax } from 'services/base';

export default class TagsService {

  getTagsList(payload) {
    return ax.post('list-tags', payload)
  }

  getTag(id) {
    return ax.get(`tags/${id}`)
  }

  addTag(payload) {
    return ax.post(`tags`, payload)
  }

  updateTag(id, payload) {
    return ax.put(`tags/${id}`, payload)
  }

  removeTag(id) {
    return ax.delete(`tags/${id}`)
  }
}
