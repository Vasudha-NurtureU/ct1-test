
import { ax, axCityAutoComplete } from 'services/base';

export default class DropdownService {

  getStatusesByCategory(params) {
    return ax.get('dropdown/statuses/getstatusandcategory', { params: params })
  }

  getStatuses(params) {
    return ax.get('dropdown/statuses', { params: params })
  }

  getCountries(params) {
    return ax.get('dropdown/countries', { params: params })
  }

  getTagCategories(params) {
    return ax.get('dropdown/tagcategories', { params: params })
  }

  getTags(params) {
    return ax.get('dropdown/tags', { params: params })
  }

  getDestinations(params) {
    return ax.get('dropdown/destinations', { params: params })
  }

  getPackages(params) {
    return ax.get('dropdown/packages', { params: params })
  }

  getCustomers(params) {
    return ax.get('dropdown/customers', { params: params })
  }

  getAssetCategories(params) {
    return ax.get('dropdown/assetcategories', { params: params })
  }

  getUserRoles(params) {
    return ax.get('listrole', { params: params })
  }

  getCityDetails(params) {
    return axCityAutoComplete.get('gplaces', { params: params })
  }

  getUserRoleList(params) {
    return ax.get(`listrole?priority=${params.priority}`)
  }
}
