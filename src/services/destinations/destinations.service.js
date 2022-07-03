
import { ax } from 'services/base';

export default class DestinationsService {

  getDestinationsList(payload) {
    return ax.post('list-destination', payload)
  }

  getDestination(id) {
    return ax.get(`destination/${id}`)
  }

  addDestination(payload) {
    return ax.post(`destination`, payload)
  }

  updateDestination(id, payload) {
    return ax.put(`destination/${id}`, payload)
  }

  removeDestination(id) {
    return ax.delete(`destination/${id}`)
  }

  updatePackageImages(id, payload) {
    return ax.put(`destination-images/${id}`, payload)
  }

  // Destination slider
  getDestinationSliderList(payload) {
    return ax.post('list-destination-slider', payload)
  }

  addSlider(payload) {
    return ax.post('destination-slider', payload)
  }

  updateSlider(id, payload) {
    return ax.put(`destination-slider/${id}`, payload)
  }

  deleteSlider(id) {
    return ax.delete(`destination-slider/${id}`)
  }

  // Destination ThingsToDo
  getDestinationThingsToDoList(payload) {
    return ax.post('list-destination-thingstodo', payload)
  }

  addThingsToDo(payload) {
    return ax.post('destination-thingstodo', payload)
  }

  updateThingsToDo(id, payload) {
    return ax.put(`destination-thingstodo/${id}`, payload)
  }

  deleteThingsToDo(id) {
    return ax.delete(`destination-thingstodo/${id}`)
  }

  updateThingsToDoImage(id, payload) {
    return ax.put(`destination-thingstodo-image/${id}`, payload)
  }

  // Destination ThingsToDo
  getDestinationBestTimeList(payload) {
    return ax.post('list-destination-besttime', payload)
  }

  addBestTime(payload) {
    return ax.post('destination-besttime', payload)
  }

  updateBestTime(id, payload) {
    return ax.put(`destination-besttime/${id}`, payload)
  }

  deleteBestTime(id) {
    return ax.delete(`destination-besttime/${id}`)
  }

  // Destination ThingsToDo
  getDestinationUsefulInfoList(payload) {
    return ax.post('list-destination-usefulinfo', payload)
  }

  addUsefulInfo(payload) {
    return ax.post('destination-usefulinfo', payload)
  }

  updateUsefulInfo(id, payload) {
    return ax.put(`destination-usefulinfo/${id}`, payload)
  }

  deleteUsefulInfo(id) {
    return ax.delete(`destination-usefulinfo/${id}`)
  }
}
