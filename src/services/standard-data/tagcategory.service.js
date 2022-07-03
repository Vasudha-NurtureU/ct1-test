
import { ax } from 'services/base'

export default class TagcategoryService {

  getTagcategoryList(params) {
    return ax.post('list-tagcategory',{ ...params })
  }

  getTagcategory(id) {
    return ax.get(`tag-category/${id}`)
  }

  addTagcategory(payload) {
    return ax.post(`tag-category`, payload)
  }

  updateTagcategory(id, payload) {
    return ax.put(`tag-category/${id}`, payload)
  }

  removeTagcategory(id) {
    return ax.delete(`tag-category/${id}`)
  }

}
