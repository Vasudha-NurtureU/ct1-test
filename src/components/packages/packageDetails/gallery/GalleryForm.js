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

const GalleryForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const destinationsService = new DestinationsService();

  const [ThingsToDoFormFields] = useState({

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
        label: 'Information',
        primeFieldProps: {
          config: {
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'blockQuote', 'undo', 'redo']
          }
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

  // form submit 
  const ThingsToDoFormFieldsonUpdate = {
    title: ThingsToDoFormFields.title,
    description: ThingsToDoFormFields.description,
    status_id: ThingsToDoFormFields.status_id,
  }

  const ThingsToDoFormFieldsOnAdd = {
    title: ThingsToDoFormFields.title,
    description: ThingsToDoFormFields.description,
    status_id: ThingsToDoFormFields.status_id
  }

  const ThingsToDoFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      addUpdateThingsToDo(formData)
    }
  }

  // form submit section 

  const ThingsToDoFormSubmitButtonGroup = () => {
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

  const addUpdateThingsToDo = async (data) => {
    if (!isEditable) {
      await response.add({
        service: destinationsService,
        method: 'addThingsToDo',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: destinationsService,
        method: 'updateThingsToDo',
        data: { itemId: initValue.id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? ThingsToDoFormFieldsOnAdd : ThingsToDoFormFieldsonUpdate}
        onFormSubmit={ThingsToDoFormOnsubmit}
        submitButtonGroup={ThingsToDoFormSubmitButtonGroup}
      />
    </div>
  );

}

export default GalleryForm;
