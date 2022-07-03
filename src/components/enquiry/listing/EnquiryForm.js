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
import EnquiryService from 'services/enquiry/enquiry.service';

const EnquiryForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const enquiryService = new EnquiryService();



  // state management start

  // validations start

  // user form section start 

  // validations 

  const [EnquiryFormFields] = useState({

    full_name: {
      properties: {
        type: 'InputText',
        label: 'Name',
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

    email_id: {
      properties: {
        type: 'InputText',
        label: 'Email',
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
    enquiry_item: {
      properties: {
        type: 'InputText',
        label: 'Enquiry Item',
        readonly: true,
        validations: {
          required: validations.required,
          maxLength: {
            value: 1000,
            message: 'Please enter name with maximum 1000 characters'
          },
        }
      }
    },
    found_from: {
      properties: {
        type: 'InputText',
        label: 'Found From',
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter name with maximum 120 characters'
          },
        }
      }
    },
    contact_no: {
      properties: {
        type: 'PhoneInput',
        label: 'Contact No',
        validations: {
          required: validations.required,
        }
      }
    },
    description: {
      properties: {
        type: 'InputTextarea',
        label: 'Description',
        validations: {
          required: validations.required
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
  const EnquiryFormFieldsonUpdate = {
    full_name: EnquiryFormFields.full_name,
    email_id: EnquiryFormFields.email_id,
    enquiry_item: EnquiryFormFields.enquiry_item,
    found_from: EnquiryFormFields.found_from,
    contact_no: EnquiryFormFields.contact_no,
    description: EnquiryFormFields.description,
    status_id: EnquiryFormFields.status_id,
  }

  const EnquiryFormFieldsOnAdd = {
    full_name: EnquiryFormFields.full_name,
    email_id: EnquiryFormFields.email_id,
    enquiry_item: EnquiryFormFields.enquiry_item,
    found_from: EnquiryFormFields.found_from,
    contact_no: EnquiryFormFields.contact_no,
    description: EnquiryFormFields.description,
    status_id: EnquiryFormFields.status_id
  }

  const EnquiryFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      addUpdateEnquiry(formData)
    }
  }

  // form submit section 

  const EnquiryFormSubmitButtonGroup = () => {
    return (
      <div className="form-button-group">
        <Button type="button" className='p-button p-button-secondary p-mr-2' label="Cancel" onClick={() => { modalPopup.toggle(false) }}>
        </Button>
        {
          isEditable && initValue.status_id === 3 &&
          <Button type="button" label="Activate" className="p-button p-button-primary p-mr-2" />
        }
        <Button type="submit" label={isEditable ? "Okay" : "Create"} className="p-button p-button-primary" />
      </div>
    )
  }

  // user form section end 

  // add new user 

  const addUpdateEnquiry = async (data) => {
    if (!isEditable) {
      await response.add({
        service: enquiryService,
        method: 'addEnquiry',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: enquiryService,
        method: 'updateEnquiry',
        data: { itemId: initValue.id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? EnquiryFormFieldsOnAdd : EnquiryFormFieldsonUpdate}
        onFormSubmit={EnquiryFormOnsubmit}
        submitButtonGroup={EnquiryFormSubmitButtonGroup}
      />
    </div>
  );

}

export default EnquiryForm;
