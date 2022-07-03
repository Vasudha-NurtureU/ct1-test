// utils 
import { toaster } from "utils/toaster";

import { modalPopup } from 'utils/modalPopup';

import { isArray, isEmpty, isObject, isString, merge } from "lodash";

let apiResponse;

// let apiResponseData = [],

const options = {
  service: "",
  method: "",
  data: {
    itemId: "",
    item: "",
  },
  toasterMessage: {
    success: '',
    error: '',
  },
  dataTable: "",
  modalPopupHide: true
}

const responseData = (apiResponse, data) => {

  try {

    // (apiResponse.data && apiResponse.data.data) ? apiResponseData = apiResponse.data.data : apiResponseData = [];

    let errMsg = "", errObj;

    if (data.toasterMessage) {

      if (!isEmpty(apiResponse.data.message) && isString(apiResponse.data.message)) {
        errMsg = apiResponse.data.message
      }

      if (!isEmpty(apiResponse.data.message) && isObject(apiResponse.data.message)) {

        errObj = Object.keys(apiResponse.data.message[0])

        if (isArray(errObj)) {
          errMsg = apiResponse.data.message[0][errObj[0]][0];
        }

      }

      if (isArray(apiResponse.data.message)) {

        if (isObject(apiResponse.data.message[0])) {

          errObj = Object.keys(apiResponse.data.message[0]);

          if (isArray(errObj)) {
            errMsg = apiResponse.data.message[0][errObj[0]][0];
          }

        } else {
          errMsg = apiResponse.data.message[0];
        }

      }

      if (isEmpty(apiResponse.data.message)) {
        errMsg = data.toasterMessage.error;
      }

    }

    if (data.modalPopupHide && !apiResponse.data.isError) {
      modalPopup.toggle(false);
    }

    if (data.toasterMessage) {
      (!apiResponse.data.isError) ? toaster.success(data.toasterMessage.success) : toaster.error(errMsg);
    }

    if (data.dataTable && data.dataTable.current && !apiResponse.data.isError) {
      data.dataTable.current.loadData();
    }

    return apiResponse;

    // return {
    //   apiResponse: apiResponse,
    //   data: apiResponseData
    // }


  } catch (err) {
    console.log(err)
    return []
  }

}

const response = {

  get: async (configData) => {

    let data;

    data = merge({}, options, configData);

    if (data.data.itemId) {
      apiResponse = await data.service[data.method](data.data.itemId).catch(err => { console.log(err) });
    }

    if (data.data.itemId && data.params) {
      apiResponse = await data.service[data.method](data.data.itemId, data.params).catch(err => { console.log(err) });
    }

    // (apiResponse.data && apiResponse.data.data) ? apiResponseData = apiResponse.data.data : apiResponseData = [];

    return apiResponse;

    // return {
    //   apiResponse: apiResponse,
    //   data: apiResponseData
    // }

  },

  getList: async (configData) => {

    let data;

    data = merge({}, options, configData);

    if (data.params) {
      apiResponse = await data.service[data.method](data.params).catch(err => { console.log(err) });
    } else {
      apiResponse = await data.service[data.method]().catch(err => { console.log(err) });
    }

    // (apiResponse.data && apiResponse.data.data) ? apiResponseData = apiResponse.data.data : apiResponseData = [];

    return apiResponse;

    // return {
    //   apiResponse: apiResponse,
    //   data: apiResponseData
    // }

  },

  add: async (configData) => {

    let data;

    options.toasterMessage.success = "Item added successfully";
    options.toasterMessage.error = "Item not added";

    data = merge({}, options, configData);

    if (data.data && data.data.item) {
      apiResponse = await data.service[data.method](data.data.item).catch(err => { console.log(err) });
      return responseData(apiResponse, data);
    }

  },
  addNoMessage: async (configData) => {

    let data;
    data = merge({},  configData);

    if (data.data && data.data.item) {
      apiResponse = await data.service[data.method](data.data.item).catch(err => { console.log(err) });
      return responseData(apiResponse, data);
    }

  },

  update: async (configData) => {

    let data;

    options.toasterMessage.success = "Item updated successfully";
    options.toasterMessage.error = "Item not updated";

    data = merge({}, options, configData);

    if (data.data && data.data.itemId) {
      apiResponse = await data.service[data.method](data.data.itemId, data.data.item).catch(err => { console.log(err) });
      return responseData(apiResponse, data);
    }

  },

  remove: async (configData) => {

    let data;

    options.toasterMessage.success = "Item deleted successfully";
    options.toasterMessage.error = "Item not deleted";

    data = merge({}, options, configData);

    if (data.data && data.data.itemId) {
      apiResponse = await data.service[data.method](data.data.itemId).catch(err => { console.log(err) });
      return responseData(apiResponse, data);
    }

  },

}

export {
  response
}