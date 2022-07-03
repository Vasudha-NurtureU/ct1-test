
import { ax } from 'services/base';

export default class PackagesService {

  getPackagesList(payload) {
    return ax.post('list-package', payload)
  }

  getPackages(id) {
    return ax.get(`package/${id}`)
  }

  addPackage(payload) {
    return ax.post(`package`, payload)
  }

  updatePackage(id, payload) {
    return ax.put(`package/${id}`, payload)
  }

  removePackage(id) {
    return ax.delete(`package/${id}`)
  }

  updatePackageImages(id, payload) {
    return ax.put(`package-images/${id}`, payload)
  }

  // Package Gallery Image
  getPackageGalleryList(payload) {
    return ax.post('list-package-gallery-image', payload)
  }

  addGalleryImage(payload) {
    return ax.post('package-gallery-image', payload)
  }

  updateGalleryImage(id, payload) {
    return ax.put(`package-gallery-image/${id}`, payload)
  }

  deleteGalleryImage(id) {
    return ax.delete(`package-gallery-image/${id}`)
  }

  // Package Itineary
  getPackageItinearyList(payload) {
    return ax.post('list-package-itineary', payload)
  }

  addItineary(payload) {
    return ax.post('package-itineary', payload)
  }

  updateItineary(id, payload) {
    return ax.put(`package-itineary/${id}`, payload)
  }

  deleteItineary(id) {
    return ax.delete(`package-itineary/${id}`)
  }

  updateItinearyImage(id, payload) {
    return ax.put(`package-itineary-image/${id}`, payload)
  }

  // Package Reviews
  getPackageReviewList(payload) {
    return ax.post('list-package-review', payload)
  }

  addReview(payload) {
    return ax.post('package-review', payload)
  }

  updateReview(id, payload) {
    return ax.put(`package-review/${id}`, payload)
  }

  deleteReview(id) {
    return ax.delete(`package-review/${id}`)
  }

  // Package Hotel options
  getPackageHoteloptionList(payload) {
    return ax.post('list-package-hoteloption', payload)
  }

  addHoteloption(payload) {
    return ax.post('package-hoteloption', payload)
  }

  updateHoteloption(id, payload) {
    return ax.put(`package-hoteloption/${id}`, payload)
  }

  deleteHoteloption(id) {
    return ax.delete(`package-hoteloption/${id}`)
  }
}
