import React, { useState } from "react";

// utils 

import { modalPopup } from 'utils/modalPopup';

import { response } from "utils/response";

import {  getUserName  } from "utils/common";

import { isEmpty } from 'lodash';

// components 

// shared components 
import CityoneDynamicForm from "shared-components/cityone-form/index";

// prime components 
import { Button } from 'primereact/button';

// services 
import UserService from 'services/user/user.service';

const UserForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;


  // variable init start 
  const userService = new UserService();

  // variable init end

  // state management start

  // validations start

  // user form section start 

  // validations 

  const [UserFormFields] = useState({
    role_id: {
      properties: {
        type: 'Dropdown',
        label: 'User Role',
        primeFieldProps: {
          disabled: true
        },
        dropdownOptions: "roles"
      }
    },
  });

  // form submit 
  const UserFormFieldsonUpdate = {
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
        <Button type="submit" label={isEditable ? "Update" : "Create"} className="p-button p-button-primary" />
      </div>
    )
  }

  // user form section end 

  // add new user 

  const addUpdateUser = async (data) => {
      await response.update({
        service: userService,
        method: 'updateUser',
        data: { itemId: initValue.user_id, item: data },
        dataTable: dataTableRef,
      })
  }

  

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={UserFormFieldsonUpdate}
        onFormSubmit={UserFormOnsubmit}
        submitButtonGroup={UserFormSubmitButtonGroup}
      />
    </div>
  );

}

export default UserForm;
