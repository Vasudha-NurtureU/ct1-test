
import { ax } from 'services/base';

export default class HelpService {

  bulkStatusUpdate(data) {
    return ax.post('bulkstatusupdate', data)
  }

  bulkDelete(data) {
    return ax.delete(`bulkDelete`, { data: data })
  }

}
