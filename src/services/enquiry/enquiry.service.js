
import { ax } from 'services/base';

export default class EnquiryService {

  getEnquiryList(payload) {
    return ax.post('list-enquiry', payload)
  }

  getEnquiry(id) {
    return ax.get(`enquiry/${id}`)
  }

  addEnquiry(payload) {
    return ax.post(`enquiry`, payload)
  }

  updateEnquiry(id, payload) {
    return ax.put(`enquiry/${id}`, payload)
  }

  removeEnquiry(id) {
    return ax.delete(`enquiry/${id}`)
  }

  getEnquiryReport(payload) {
    return ax.post(`enquiry-report`, payload)
  }
}
