import { ax } from 'services/base'

export default class CategoryService {

  getCategory(id) {
    return ax.get(`assetcategory/${id}`)
  }

  getCategoryList(payload) {
    return ax.post('asset-category-list', payload)
  }
  getCategoryListDropDown() {
    return ax.get('dropdown/assetcategories')
  }

  addCategory(payload) {
    return ax.post(`assetcategory`, payload)
  }

  updateCategory(id, payload) {
    return ax.put(`assetcategory/${id}`, payload)
  }

  removeCategory(id) {
    return ax.delete(`assetcategory/${id}`)
  }

}
