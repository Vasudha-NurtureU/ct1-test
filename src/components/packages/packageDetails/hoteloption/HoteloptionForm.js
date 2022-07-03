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

const HoteloptionForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const packageService = new PackageService();

  const [HoteloptionFormFields] = useState({

    data: {
      properties: {
        type: 'InputTextarea',
        label: 'Data',
        readonly: true,
        validations: {
          required: validations.required,
        }
      }
    },
    type: {
      properties: {
        type: 'Dropdown',
        label: 'Type',
        primeFieldProps: {
          options: [
            {
              label: 'Header',
              value: 'header'
            },
            {
              label: 'Row',
              value: 'row'
            }
          ]
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
  const HoteloptionFormFieldsonUpdate = {
    data: HoteloptionFormFields.data,
    type: HoteloptionFormFields.type,
    status_id: HoteloptionFormFields.status_id,
  }

  const HoteloptionFormFieldsOnAdd = {
    data: HoteloptionFormFields.data,
    type: HoteloptionFormFields.type,
    status_id: HoteloptionFormFields.status_id,
  }

  const HoteloptionFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      addUpdateHoteloption(formData)
    }
  }

  // form submit section 

  const HoteloptionFormSubmitButtonGroup = () => {
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

  const addUpdateHoteloption = async (data) => {
    if (!isEditable) {
      await response.add({
        service: packageService,
        method: 'addHoteloption',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: packageService,
        method: 'updateHoteloption',
        data: { itemId: initValue.id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? HoteloptionFormFieldsOnAdd : HoteloptionFormFieldsonUpdate}
        onFormSubmit={HoteloptionFormOnsubmit}
        submitButtonGroup={HoteloptionFormSubmitButtonGroup}
      />
    </div>
  );

}

export default HoteloptionForm;
