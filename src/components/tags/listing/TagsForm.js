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
import TagsService from 'services/tags/tags.service';

const TagsForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const tagsService = new TagsService();



  // state management start

  // validations start

  // user form section start 

  // validations 

  const [TagsFormFields] = useState({

    name: {
      properties: {
        type: 'InputText',
        label: 'Name',
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter name with maximum 120 characters'
          },
        }
      }
    },
    tag_category_id: {
      properties: {
        type: 'Dropdown',
        label: 'Tag Category',
        primeFieldProps: {
        },
        validations: {
          required: validations.required,
        },
        dropdownOptions: "tagCategories"
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
  const TagsFormFieldsonUpdate = {
    name: TagsFormFields.name,
    tag_category_id: TagsFormFields.tag_category_id,
    status_id: TagsFormFields.status_id,
  }

  const TagsFormFieldsOnAdd = {
    name: TagsFormFields.name,
    tag_category_id: TagsFormFields.tag_category_id,
    status_id: TagsFormFields.status_id,
  }

  const TagsFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      addUpdateTags(formData)
    }
  }

  // form submit section 

  const TagsFormSubmitButtonGroup = () => {
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

  const addUpdateTags = async (data) => {
    if (!isEditable) {
      await response.add({
        service: tagsService,
        method: 'addTag',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: tagsService,
        method: 'updateTag',
        data: { itemId: initValue.id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? TagsFormFieldsOnAdd :TagsFormFieldsonUpdate}
        onFormSubmit={TagsFormOnsubmit}
        submitButtonGroup={TagsFormSubmitButtonGroup}
      />
    </div>
  );

}

export default TagsForm;
