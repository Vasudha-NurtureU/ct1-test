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

const SliderForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const destinationsService = new DestinationsService();

  const [SliderFormFields] = useState({

    title: {
      properties: {
        type: 'InputText',
        label: 'Title',
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
    description: {
      properties: {
        type: 'InputTextarea',
        label: 'Description',
        validations: {
          required: validations.required,
          maxLength: {
            value: 220,
            message: 'Please enter name with maximum 220 characters'
          },
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

  // form submit 
  const SliderFormFieldsonUpdate = {
    title: SliderFormFields.title,
    description: SliderFormFields.description,
    status_id: SliderFormFields.status_id,
  }

  const SliderFormFieldsOnAdd = {
    title: SliderFormFields.title,
    description: SliderFormFields.description,
    status_id: SliderFormFields.status_id
  }

  const SlidersFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      addUpdateSlider(formData)
    }
  }

  // form submit section 

  const SlidersFormSubmitButtonGroup = () => {
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

  const addUpdateSlider = async (data) => {
    if (!isEditable) {
      await response.add({
        service: destinationsService,
        method: 'addSlider',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: destinationsService,
        method: 'updateSlider',
        data: { itemId: initValue.id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? SliderFormFieldsOnAdd : SliderFormFieldsonUpdate}
        onFormSubmit={SlidersFormOnsubmit}
        submitButtonGroup={SlidersFormSubmitButtonGroup}
      />
    </div>
  );

}

export default SliderForm;
