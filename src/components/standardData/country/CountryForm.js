import React, { useState } from "react";

// utils 

import { validations } from 'utils/validations';

import { isEmpty } from 'lodash';

import { response } from "utils/response";

import { getUserName } from "utils/common";

// components 

// shared components 
import CityoneDynamicForm from "shared-components/cityone-form/index";

// services 
import CountryService from 'services/standard-data/country.service';

const CountryForm = (props) => {

  // props destructure start
  const { initialValue, dataTableRef } = props;
  const { initValue, isEditable } = initialValue;
  // props destructure end

  // variable init start 
  const countryService = new CountryService()
  // variable init end

  // state management start

  // validations start
  const [CountryFormFields] = useState({
    country_name: {
      properties: {
        type: 'InputText',
        label: 'Name',
        primeFieldProps: {

        },
        validations: {
          required: validations.required,
        }
      }
    },
    status_id: {
      properties: {
        type: 'Dropdown',
        label: 'Status',
        primeFieldProps: {
        },
        validations: {
          required: validations.required,
        },
        dropdownOptions: "generalStatus"

      }
    },
  });
  // validations end

  // state management end

  // country form section start 

  // form submit section start

  const CountryFormOnsubmit = (data, error) => {
    let formData = { ...initValue, ...data }
    if (isEmpty(error)) {
      formData = getUserName(isEditable, formData)

      addUpdateCountry(formData)
    }
  }

  // form submit section end

  // add new and update country section start
  const addUpdateCountry = async (data) => {

    if (!isEditable) {
      await response.add({
        service: countryService,
        method: 'addCountry',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: countryService,
        method: 'updateCountry',
        data: { itemId: initValue.country_id, item: data },
        dataTable: dataTableRef,
      })
    }

  }
  // add new and update country section end

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={CountryFormFields}
        onFormSubmit={CountryFormOnsubmit}
      >
      </CityoneDynamicForm>
    </div>
  );

}

export default CountryForm;
