import { ax } from 'services/base';

export default class GalleryService {

  getMediaList(payload) {
    return ax.post('gallery', payload)
  }

}