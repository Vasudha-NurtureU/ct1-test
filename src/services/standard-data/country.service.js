
import { ax } from 'services/base'

export default class CountryService {

  getCountryList(params) {
    return ax.post('listcountry',{ ...params })
  }

  getCountry(id) {
    return ax.get(`country/${id}`)
  }

  addCountry(payload) {
    return ax.post(`country`, payload)
  }

  updateCountry(id, payload) {
    return ax.put(`country/${id}`, payload)
  }

  removeCountry(id) {
    return ax.delete(`country/${id}`)
  }

}
