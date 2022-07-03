import React, { useState } from "react";

// utils 

import { validations } from 'utils/validations';

import { isEmpty } from 'lodash';

import { response } from "utils/response";

import { getUserName } from "utils/common";

// components 

// shared components 
import CityoneDynamicForm from "shared-components/cityone-form/index";

// services 
import TagcategoryService from 'services/standard-data/tagcategory.service';

const TagcategoryForm = (props) => {

  // props destructure start
  const { initialValue, dataTableRef } = props;
  const { initValue, isEditable } = initialValue;
  // props destructure end

  // variable init start 
  const tagcategoryService = new TagcategoryService();
  // variable init end

  // state management start

  // validations start
  const [TagcategoriesFormFields] = useState({
    name: {
      properties: {
        type: 'InputText',
        label: 'Tag category Name',
        primeFieldProps: {

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
  // validations end

  // state management end

  // country form section start 

  // form submit section start

  const TagcategoryFormOnsubmit = (data, error) => {
    let formData = { ...initValue, ...data }
    if (isEmpty(error)) {
      formData = getUserName(isEditable, formData)

      addUpdateTagcategory(formData)
    }
  }

  // form submit section end

  // add new and update country section start
  const addUpdateTagcategory = async (data) => {

    if (!isEditable) {
      await response.add({
        service: tagcategoryService,
        method: 'addTagcategory',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: tagcategoryService,
        method: 'updateTagcategory',
        data: { itemId: initValue.id, item: data },
        dataTable: dataTableRef,
      })
    }

  }
  // add new and update country section end

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={TagcategoriesFormFields}
        onFormSubmit={TagcategoryFormOnsubmit}
      >
      </CityoneDynamicForm>
    </div>
  );

}

export default TagcategoryForm;
