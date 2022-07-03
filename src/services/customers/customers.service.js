
import { ax } from 'services/base';

export default class CustomersService {

  getCustomersList(payload) {
    return ax.post('customer-list', payload)
  }

  getCustomers(id) {
    return ax.get(`customer/${id}`)
  }

  addCustomer(payload) {
    return ax.post(`customer`, payload)
  }

  updateCustomer(id, payload) {
    return ax.put(`customer/${id}`, payload)
  }

  removeCustomer(id) {
    return ax.delete(`customer/${id}`)
  }

  getCustomerReport(payload) {
    return ax.post(`customer-report`, payload)
  }
}
