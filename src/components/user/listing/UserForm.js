import React, { useState } from "react";

// utils 
import { toaster } from "utils/toaster";

import { modalPopup } from 'utils/modalPopup';

import { validations } from 'utils/validations';

import { response } from "utils/response";

import { getUserName } from "utils/common";

import { isEmpty } from 'lodash';

// components 

// shared components 
import CityoneDynamicForm from "shared-components/cityone-form/index";

// prime components 
import { Button } from 'primereact/button';

import { Divider } from 'primereact/divider';

// services 
import UserService from 'services/user/user.service';

const UserForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const userService = new UserService();

  const passwordHeader = <h6>Pick a password</h6>;

  const passwordFooter = (
    <React.Fragment>
      <Divider />
      <p className="p-mt-2">Suggestions</p>
      <ul className="p-pl-2 p-ml-2 p-mt-0" style={{ lineHeight: '1.5' }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>At least one special character</li>
        <li>Minimum 8 characters</li>
      </ul>
    </React.Fragment>
  );
  // variable init end

  // state management start

  // validations start

  // user form section start 

  // validations 

  const [UserFormFields] = useState({

    name: {
      properties: {
        type: 'InputText',
        label: 'Name',
        validations: {
          required: validations.required,
          pattern: validations.userName,
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

    password: {
      properties: {
        type: 'Password',
        label: 'Password',
        primeFieldProps: {
          header: passwordHeader,
          footer: passwordFooter,
        },
        validations: {
          required: validations.required,
        }
      }
    },

    contact_number: {
      properties: {
        type: 'PhoneInput',
        label: 'Phone No',
        validations: {
          required: validations.required,
        }
      }
    },
    role_id: {
      properties: {
        type: 'Dropdown',
        label: 'User Role',
        validations: {
          required: validations.required,
        },
        primeFieldProps: {
          filter: true
        },
        dropdownOptions: "roles"
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
  const UserFormFieldsonUpdate = {
    name: UserFormFields.name,
    email_address: UserFormFields.email_address,
    contact_number: UserFormFields.contact_number,
    status_id: UserFormFields.status_id,
    role_id: UserFormFields.role_id,
  }

  const UserFormFieldsOnAdd = {
    name: UserFormFields.name,
    email_address: UserFormFields.email_address,
    password: UserFormFields.password,
    contact_number: UserFormFields.contact_number,
    role_id: UserFormFields.role_id,
  }

  const UserFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      formData = getUserName(isEditable, formData)
      addUpdateUser(formData)
    }
  }

  // form submit section 

  const UserFormSubmitButtonGroup = () => {
    return (
      <div className="form-button-group">
        <Button type="button" className='p-button p-button-secondary p-mr-2' label="Cancel" onClick={() => { modalPopup.toggle(false) }}>
        </Button>
        {
          isEditable && initValue.status_id === 3 &&
          <Button type="button" label="Activate" className="p-button p-button-primary p-mr-2" onClick={() => ActivateUser()} />
        }
        <Button type="submit" label={isEditable ? "Update" : "Create"} className="p-button p-button-primary" />
      </div>
    )
  }

  // user form section end 

  // add new user 

  const addUpdateUser = async (data) => {
    if (!isEditable) {
      await response.add({
        service: userService,
        method: 'addUser',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: userService,
        method: 'updateUser',
        data: { itemId: initValue.user_id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  const ActivateUser = async () => {
    let userResponse, userResponseData;
    try {
      userResponse = await userService.activateUser({ email_address: initValue.email_address });

      if (userResponse.data) {
        userResponseData = userResponse.data;
      }
      if (!userResponseData.isError) {
        toaster.success(userResponseData.message || 'User Activated successfully');
        (dataTableRef.current) ? dataTableRef.current.loadData() : console.log("empty datatable");
        modalPopup.toggle(false);
      } else {
        toaster.error(userResponseData.message || 'User not activated')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? UserFormFieldsOnAdd : UserFormFieldsonUpdate}
        onFormSubmit={UserFormOnsubmit}
        submitButtonGroup={UserFormSubmitButtonGroup}
      />
    </div>
  );

}

export default UserForm;
