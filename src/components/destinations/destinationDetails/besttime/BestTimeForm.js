import React, { useState } from "react";

// utils 

import { modalPopup } from 'utils/modalPopup';

import { validations } from 'utils/validations';

import { response } from "utils/response";


import { isEmpty } from 'lodash';

// components 

// shared components 
import CityoneDynamicForm from "shared-components/cityone-form/index";

// prime components 
import { Button } from 'primereact/button';

// services 
import DestinationsService from 'services/destinations/destinations.service';

const BestTimeForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const destinationsService = new DestinationsService();

  const [BestTimeFormFields] = useState({
    month: {
      properties: {
        type: 'InputText',
        label: 'Month',
        readonly: true,
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter name with maximum 120 characters'
          },
        }
      }
    },

    weather: {
      properties: {
        type: 'InputText',
        label: 'Weather',
        readonly: true,
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter name with maximum 120 characters'
          },
        }
      }
    }
  });

  // form submit 
  const BestTimeFormFieldsonUpdate = {
    month: BestTimeFormFields.month,
    weather: BestTimeFormFields.weather
  }

  const BestTimeFormFieldsOnAdd = {
    month: BestTimeFormFields.month,
    weather: BestTimeFormFields.weather
  }

  const BestTimeFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      addUpdateBestTime(formData)
    }
  }

  // form submit section 

  const BestTimeFormSubmitButtonGroup = () => {
    return (
      <div className="form-button-group">
        <Button type="button" className='p-button p-button-secondary p-mr-2' label="Cancel" onClick={() => { modalPopup.toggle(false) }}>
        </Button>
        {
          isEditable && initValue.status_id === 3 &&
          <Button type="button" label="Activate" className="p-button p-button-primary p-mr-2" />
        }
        <Button type="submit" label={isEditable ? "Update" : "Create"} className="p-button p-button-primary" />
      </div>
    )
  }

  // user form section end 

  // add new user 

  const addUpdateBestTime = async (data) => {
    if (!isEditable) {
      await response.add({
        service: destinationsService,
        method: 'addBestTime',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: destinationsService,
        method: 'updateBestTime',
        data: { itemId: initValue.id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? BestTimeFormFieldsOnAdd : BestTimeFormFieldsonUpdate}
        onFormSubmit={BestTimeFormOnsubmit}
        submitButtonGroup={BestTimeFormSubmitButtonGroup}
      />
    </div>
  );

}

export default BestTimeForm;
