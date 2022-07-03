import React, { useState, useEffect } from 'react';

// components
// prime components
import { Button } from 'primereact/button';

// shared components
import CityoneDynamicForm from 'shared-components/cityone-form/index';

// utils
import { isEmpty, isObject } from 'lodash';

import { validations } from 'utils/validations'

import { dropdown } from 'utils/dropdown';

import { response } from 'utils/response';

import { getUser, getUserID } from 'utils/common';

// services 
import UserService from 'services/user/user.service';

const UpdateProfile = (props) => {

  // variable init start
  const userUpdate = new UserService();
  // variable init end

  // state management start
  const [registerFormConfig] = useState({
    formClassName: 'register-form-wrapper',
    formSectionClassName: 'register-form-section',
    autoComplete: 'off',
  });

  const [registerFormInitialValue] = useState({
    name: (props.data !== null && props.data !== undefined) ? props.data.name : null,
    email_address: (props.data !== null && props.data !== undefined) ? props.data.email_address : null,
    contact_number: (props.data !== null && props.data !== undefined) ? props.data.contact_number : null,
    password: (props.data !== null && props.data !== undefined) ? props.data.password : null,
    role_id: (props.data !== null && props.data !== undefined) ? props.data.role_id : null,
    status_id: (props.data !== null && props.data !== undefined) ? props.data.status_id : null
  });

  const [registerFormFields] = useState({

    name: {
      properties: {
        type: 'InputText',
        label: 'Name',
        fieldWrapperClassNames: 'p-md-6',
        primeFieldProps: {},
        validations: {
          required: validations.required,
        }
      },
    },

    email_address: {
      properties: {
        type: 'InputText',
        label: 'Email',
        fieldWrapperClassNames: 'p-md-6',
        primeFieldProps: {
          keyfilter: 'email',
          readOnly: true
        },
        validations: {
          required: validations.required,
          pattern: validations.email
        }
      },
    },
    contact_number: {
      properties: {
        type: 'PhoneInput',
        label: 'Contact Number',
        fieldWrapperClassNames: 'p-md-6',
        validations: {
          required: validations.required,
        }
      },
    }

  });
  // state management start

  useEffect(() => {
    dropdown.country();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form button group section start
  const registerSubmitButtonGroup = () => {
    return (
      <div className="p-d-flex p-jc-end p-mt-3 p-pr-2">
        <Button type="Submit" label="Update" className="p-button-success" />
      </div>
    )
  };
  // form button group section end

  // form submit section start
  const registerFormOnsubmit = async (data, err) => {
    if (isEmpty(err)) {
      try {
        let formData = new FormData();

        formData.append("_method", "PUT");
        formData.append("updated_by", getUser().email);
        Object.keys(data).forEach(key => {
          if (key === "photo") {
            if (data[key][0]) {
              formData.append(key, data[key])
            }
          }
          else {
            formData.append(key, data[key])
          }
        });

        let apiResponse = await response.update({
          service: userUpdate,
          method: 'updateUserProfile',
          data: { itemId: getUserID(), item: formData },
          toasterMessage: {
            success: 'User updated successfully',
            error: 'User not updated'
          }
        });

        if (apiResponse && apiResponse.data && !apiResponse.data.isError && isObject(apiResponse.data.data)) {
          props.setuserInfo(apiResponse.data.data);
        }
      } catch (err) {
        console.log(err)
      }
    }

  };
  // form submit section start

  return (

    <div className='login-section account register-section'>
      <div className="card-wrapper">
        <div className="register">
          <CityoneDynamicForm
            formConfig={registerFormConfig}
            initialValues={registerFormInitialValue}
            fields={registerFormFields}
            onFormSubmit={registerFormOnsubmit}
            submitButtonGroup={registerSubmitButtonGroup}>
          </CityoneDynamicForm>

        </div>

      </div>
    </div>
  )

}

export default UpdateProfile;
