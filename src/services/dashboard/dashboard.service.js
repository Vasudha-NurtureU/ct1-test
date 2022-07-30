import { ax } from 'services/base';

export default class DashboardService {

  getCountsOfCards() {
    return ax.get('maindashboard');
  }

  recentBookings() {
    return ax.post('recentbookings');
  }

  recentEnquires() {
    return ax.post('recentqueries');
  }

  triggerDeployment() {
    return ax.post('deploy');
  }
}