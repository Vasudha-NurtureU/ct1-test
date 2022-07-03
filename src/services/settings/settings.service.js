import { ax } from 'services/base'

export default class SettingsService {
  getGlobalconfig() {
    return ax.get('globalconfig')
  }
  getGlobalconfigUpdate(payload) {
    return ax.put('globalconfig',payload)
  }
}