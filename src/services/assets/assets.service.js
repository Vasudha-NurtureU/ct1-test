import { ax } from 'services/base';

const config = { headers: { 'content-type': 'multipart/form-data' } }

export default class AssetsService {

  getAsset(id) {
    return ax.get(`asset/${id}`)
  }

  getAssetsList(payload) {
    return ax.post(`asset-list`, payload)
  }

  addAsset(payload) {
    return ax.post(`asset`, payload, config)
  }

  updateAsset(id, payload) {
    return ax.post(`asset/${id}`, payload)
  }

  removeAsset(id) {
    return ax.delete(`asset/${id}`)
  }

}