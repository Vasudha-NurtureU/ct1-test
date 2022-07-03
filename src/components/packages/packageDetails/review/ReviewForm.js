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

const ReviewForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const packageService = new PackageService();

  const [ReviewFormFields] = useState({

    review: {
      properties: {
        type: 'InputTextarea',
        label: 'Review',
        readonly: true,
        validations: {
          required: validations.required
        }
      }
    },
    ratings: {
      properties: {
        type: 'Dropdown',
        label: 'Ratings',
        primeFieldProps: {
          options: [
            {
              label: '1',
              value: 1
            },
            {
              label: '2',
              value: 2
            },
            {
              label: '3',
              value: 3
            },
            {
              label: '4',
              value: 4
            },
            {
              label: '5',
              value: 5
            }
          ]
        },
        validations: {
          required: validations.required,
        }
      }
    },
    user_id: {
      properties: {
        type: 'Dropdown',
        label: 'Customer',
        dropdownOptions: "customers",
        primeFieldProps: {
          readOnly: isEditable ? true : false,
        },
        validations: {
          required: validations.required,
          maxLength: {
            value: 180,
            message: 'Please choose a customer'
          }
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
  const ReviewFormFieldsonUpdate = {
    review: ReviewFormFields.review,
    ratings: ReviewFormFields.ratings,
    user_id: ReviewFormFields.user_id,
    status_id: ReviewFormFields.status_id,
  }

  const ReviewFormFieldsOnAdd = {
    review: ReviewFormFields.review,
    ratings: ReviewFormFields.ratings,
    user_id: ReviewFormFields.user_id,
    status_id: ReviewFormFields.status_id,
  }

  const ReviewFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      addUpdateReview(formData)
    }
  }

  // form submit section 

  const ReviewFormSubmitButtonGroup = () => {
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

  const addUpdateReview = async (data) => {
    if (!isEditable) {
      await response.add({
        service: packageService,
        method: 'addReview',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: packageService,
        method: 'updateReview',
        data: { itemId: initValue.id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? ReviewFormFieldsOnAdd : ReviewFormFieldsonUpdate}
        onFormSubmit={ReviewFormOnsubmit}
        submitButtonGroup={ReviewFormSubmitButtonGroup}
      />
    </div>
  );

}

export default ReviewForm;
