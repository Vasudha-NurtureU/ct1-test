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

const UsefulinfoForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const destinationsService = new DestinationsService();

  const [UsefulinfoFormFields] = useState({

    language: {
      properties: {
        type: 'InputText',
        label: 'Language',
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
    currency: {
      properties: {
        type: 'InputText',
        label: 'Currency',
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
    timeZone: {
      properties: {
        type: 'InputText',
        label: 'Time Zone',
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
    best_time_travel: {
      properties: {
        type: 'InputText',
        label: 'Best Time To Travel',
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
  const UsefulinfoFormFieldsonUpdate = {
    language: UsefulinfoFormFields.language,
    currency: UsefulinfoFormFields.currency,
    timeZone: UsefulinfoFormFields.timeZone,
    best_time_travel: UsefulinfoFormFields.best_time_travel,
  }

  const UsefulinfoFormFieldsOnAdd = {
    language: UsefulinfoFormFields.language,
    currency: UsefulinfoFormFields.currency,
    timeZone: UsefulinfoFormFields.timeZone,
    best_time_travel: UsefulinfoFormFields.best_time_travel,
  }

  const UsefulinfoFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      addUpdateUsefulinfo(formData)
    }
  }

  // form submit section 

  const UsefulinfoFormSubmitButtonGroup = () => {
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

  const addUpdateUsefulinfo = async (data) => {
    if (!isEditable) {
      await response.add({
        service: destinationsService,
        method: 'addUsefulInfo',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: destinationsService,
        method: 'updateUsefulInfo',
        data: { itemId: initValue.id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? UsefulinfoFormFieldsOnAdd : UsefulinfoFormFieldsonUpdate}
        onFormSubmit={UsefulinfoFormOnsubmit}
        submitButtonGroup={UsefulinfoFormSubmitButtonGroup}
      />
    </div>
  );

}

export default UsefulinfoForm;
