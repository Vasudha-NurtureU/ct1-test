import appStore from 'store/index';

// utils
import { isEmpty } from 'lodash';

import { lStorage } from 'utils/storage';

// services
import DropdownService from 'services/dropdown/dropdown.service';

import {
  STATUS,
  COUNTRY,
  TAGCATRGORIES,
  TAGS,
  DESTINATIONS,
  PACKAGES,
  CUSTOMERS,
  ASSETCATEGORRY,
  GENERALSTATUS,
  USERSTATUS,
  BOOKINGSTATUS,
  CLEAR,
  USERROLE,
  USERROLELIST
} from 'store/actions/type/dropdown';

const getGeneralStatuses = async () => {
  try {
    let dd = appStore.getState().dropdownDetails;

    if (isEmpty(dd.generalStatus)) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getStatusesByCategory({ status_category: "GENERAL" })

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.status_name, value: value.status_id, slug: value.status_slug }
          });
          appStore.dispatch({ type: GENERALSTATUS, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}

const getTagCategories = async () => {
  try {
    let dd = appStore.getState().dropdownDetails;

    if (isEmpty(dd.tagCategories)) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getTagCategories();

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.name, value: value.id, id: value.id, slug: value.slug }
          });
          appStore.dispatch({ type: TAGCATRGORIES, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}

const getTags = async () => {
  try {
    let dd = appStore.getState().dropdownDetails;

    if (isEmpty(dd.tags)) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getTags();

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.name, value: value.id, id: value.id, slug: value.slug }
          });
          appStore.dispatch({ type: TAGS, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}

const getDestinations = async () => {
  try {
    let dd = appStore.getState().dropdownDetails;

    if (isEmpty(dd.destinations)) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getDestinations();

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.name, value: value.id, slug: value.slug }
          });
          appStore.dispatch({ type: DESTINATIONS, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}

const getPackages = async () => {
  try {
    let dd = appStore.getState().dropdownDetails;

    if (isEmpty(dd.packages)) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getPackages();

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.name, value: value.id, slug: value.name }
          });
          appStore.dispatch({ type: PACKAGES, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}

const getCustomers = async () => {
  try {
    let dd = appStore.getState().dropdownDetails;

    if (isEmpty(dd.customers)) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getCustomers();

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.first_name + ' ' + value.last_name, value: value.customer_id }
          });
          appStore.dispatch({ type: CUSTOMERS, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}

const getUserStatuses = async () => {
  try {
    let dd = appStore.getState().dropdownDetails;

    if (isEmpty(dd.userStatus)) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getStatusesByCategory({ status_category: "USER" })

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.status_name, value: value.status_id, slug: value.status_slug }
          });
          appStore.dispatch({ type: USERSTATUS, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}

const getBookingStatuses = async () => {
  try {
    let dd = appStore.getState().dropdownDetails;

    if (isEmpty(dd.bookingStatus)) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getStatusesByCategory({ status_category: "BOOKING" })

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.status_name, value: value.status_id, slug: value.status_slug }
          });
          appStore.dispatch({ type: BOOKINGSTATUS, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}


const getStatuses = async () => {
  try {
    let dd = appStore.getState().dropdownDetails;

    if (isEmpty(dd.status)) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getStatuses()

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.status_name, value: value.status_id, slug: value.status_slug }
          });
          appStore.dispatch({ type: STATUS, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}

const getCountries = async () => {
  try {
    let dd = appStore.getState().dropdownDetails;

    if (isEmpty(dd.country)) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getCountries()

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.country_name, value: value.country_id, slug: value.country_slug }
          });
          appStore.dispatch({ type: COUNTRY, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}


const getAssetCategories = async () => {
  try {
    let dd = appStore.getState().dropdownDetails;

    if (isEmpty(dd.assetCategory)) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getAssetCategories()

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.label, value: value.asset_category_id, slug: value.slug }
          });
          appStore.dispatch({ type: ASSETCATEGORRY, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}


const getUserRoles = async () => {
  try {
    appStore.dispatch({ type: USERROLE, payload: [] })

    let userDetails = lStorage.get('authInfo');

    if (userDetails && userDetails.role_priority) {
      let dropdownService = new DropdownService()
      let apiResponse = await dropdownService.getUserRoles({ priority: userDetails.role_priority })

      if (apiResponse && apiResponse.data) {
        let apiResponseData = apiResponse.data;

        if (!apiResponseData.isError) {
          let dropdownOptions = apiResponseData.data.map(value => {
            return { label: value.label, value: value.role_id, slug: value.slug }
          });
          appStore.dispatch({ type: USERROLE, payload: dropdownOptions })
        }
      }
    }
  }
  catch {
    console.log("Something went wrong.");
  }
}


const getUserRoleForRegister = async () => {

  let dropdownService = new DropdownService()
  let apiResponse = await dropdownService.getUserRoleList({ priority: 2 })
  if (apiResponse && apiResponse.data) {
    let apiResponseData = apiResponse.data;
    if (!apiResponseData.isError) {
      let dropdownOptions = apiResponseData.data.map(value => {
        return { label: value.label, value: value.role_id, slug: value.slug }
      });
      appStore.dispatch({ type: USERROLELIST, payload: dropdownOptions })
    }
  }
}


const clearDropdown = () => {
  appStore.dispatch({ type: CLEAR })
}

export const dropdown = {
  status: getStatuses,
  country: getCountries,
  tagCategories: getTagCategories,
  tags: getTags,
  destinations: getDestinations,
  packages: getPackages,
  customers: getCustomers,
  assetCategory: getAssetCategories,
  generalStatus: getGeneralStatuses,
  userStatus: getUserStatuses,
  bookingStatus: getBookingStatuses,
  clear: clearDropdown,
  roles: getUserRoles,
  userRoleList: getUserRoleForRegister,
}
