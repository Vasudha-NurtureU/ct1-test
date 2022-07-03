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
import CustomersService from 'services/customers/customers.service';

const CustomersForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const customersService = new CustomersService();



  // state management start

  // validations start

  // user form section start 

  // validations 

  const [CustomersFormFields] = useState({

    first_name: {
      properties: {
        type: 'InputText',
        label: 'First Name',
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

    last_name: {
      properties: {
        type: 'InputText',
        label: 'Last Name',
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

    email_address: {
      properties: {
        type: 'InputText',
        label: 'Email Address',
        primeFieldProps: {
          readOnly: isEditable ? true : false,
        },
        validations: {
          required: validations.required,
          pattern: validations.email,
          maxLength: {
            value: 180,
            message: 'Please enter email address with maximum 180 characters'
          }
        }
      }
    },
    contact_number: {
      properties: {
        type: 'PhoneInput',
        label: 'Contact Number',
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter name with maximum 120 characters'
          },
        }
      }
    },
    city: {
      properties: {
        type: 'InputText',
        label: 'City',
        validations: {
          required: validations.required,
        }
      }
    },
    country_id: {
      properties: {
        type: 'Dropdown',
        label: 'Country',
        primeFieldProps: {
        },
        validations: {
          required: validations.required,
        },
        dropdownOptions: "country"
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
  const CustomersFormFieldsonUpdate = {
    first_name: CustomersFormFields.first_name,
    last_name: CustomersFormFields.last_name,
    email_address: CustomersFormFields.email_address,
    contact_number: CustomersFormFields.contact_number,
    city: CustomersFormFields.city,
    country_id: CustomersFormFields.country_id,
    status_id: CustomersFormFields.status_id,
  }

  const CustomersFormFieldsOnAdd = {
    name: CustomersFormFields.name,
    email_address: CustomersFormFields.email_address,
    contact_number: CustomersFormFields.contact_number,
    city: CustomersFormFields.city,
    country_id: CustomersFormFields.country_id,
    status_id: CustomersFormFields.status_id,
  }

  const CustomersFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      addUpdateCustomer(formData)
    }
  }

  // form submit section 

  const CustomersFormSubmitButtonGroup = () => {
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

  const addUpdateCustomer = async (data) => {
    if (!isEditable) {
      await response.add({
        service: customersService,
        method: 'addCustomer',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: customersService,
        method: 'updateCustomer',
        data: { itemId: initValue.customer_id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? CustomersFormFieldsOnAdd : CustomersFormFieldsonUpdate}
        onFormSubmit={CustomersFormOnsubmit}
        submitButtonGroup={CustomersFormSubmitButtonGroup}
      />
    </div>
  );

}

export default CustomersForm;
