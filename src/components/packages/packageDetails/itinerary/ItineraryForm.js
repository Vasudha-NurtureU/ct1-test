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
import PackageService from 'services/packages/packages.service';

const ItineraryForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const packageService = new PackageService();

  const [ItinearyFormFields] = useState({

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
        type: 'RichTextEditor',
        label: 'Description',
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

  // form submit 
  const ItinearyFormFieldsonUpdate = {
    title: ItinearyFormFields.title,
    description: ItinearyFormFields.description,
    status_id: ItinearyFormFields.status_id,
  }

  const ItinearyFormFieldsOnAdd = {
    title: ItinearyFormFields.title,
    description: ItinearyFormFields.description,
    status_id: ItinearyFormFields.status_id
  }

  const ItinearyFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      addUpdateItineary(formData)
    }
  }

  // form submit section 

  const ItinearyFormSubmitButtonGroup = () => {
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

  const addUpdateItineary = async (data) => {
    if (!isEditable) {
      await response.add({
        service: packageService,
        method: 'addItineary',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: packageService,
        method: 'updateItineary',
        data: { itemId: initValue.id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? ItinearyFormFieldsOnAdd : ItinearyFormFieldsonUpdate}
        onFormSubmit={ItinearyFormOnsubmit}
        submitButtonGroup={ItinearyFormSubmitButtonGroup}
      />
    </div>
  );

}

export default ItineraryForm;
