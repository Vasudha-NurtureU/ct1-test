
import { ax } from 'services/base';

export default class BookingsService {

  getBookingsList(payload) {
    return ax.post('list-booking', payload)
  }

  getBooking(id) {
    return ax.get(`booking/${id}`)
  }

  addBooking(payload) {
    return ax.post(`booking`, payload)
  }

  updateBooking(id, payload) {
    return ax.put(`booking/${id}`, payload)
  }

  removeBooking(id) {
    return ax.delete(`booking/${id}`)
  }

  geBookingReport(payload) {
    return ax.post(`booking-report`, payload)
  }
}
