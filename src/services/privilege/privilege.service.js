
import { ax } from 'services/base'

export default class PrivelegeService {

  getRoleprivilageassignmentsList(role_id) {
    return ax.get(`roleprivilageassignments/${role_id.val}`)
  }
 
  privilageAssignment(payload) {
    return ax.post(`privilageassignment`, payload)
  }

  privilageassignmentData(id) {
    return ax.put(`privilageassignment/${id.role_id}`,{...id})
  }

}
