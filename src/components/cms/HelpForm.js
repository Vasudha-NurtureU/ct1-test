import React, { useState } from "react";

// utils 
import { validations } from 'utils/validations';

import { response } from "utils/response";

import { getUserName } from "utils/common";

import { isEmpty } from 'lodash';

import { modalPopup } from 'utils/modalPopup';

// import { galleryPopup } from "utils/galleryPopup";

// components 

// shared components 
import CityoneDynamicForm from "shared-components/cityone-form/index";

// prime components 
import { Button } from 'primereact/button';

// services 
import HelpService from 'services/cms/help.service';

const HelpForm = (props) => {

  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;
  // props destructure end

  // variable init start 
  const helpService = new HelpService()
  // variable init end

  // state management start

  // validations start
  const [HelpFormFields] = useState({
    page_title: {
      properties: {
        type: 'InputText',
        label: 'Title',
        validations: {
          required: validations.required,
          maxLength: {
            value: 220,
            message: 'Please enter title with maximum 220 characters'
          }
        }
      }
    },
    page_content: {
      properties: {
        type: 'RichTextEditor',
        label: 'Content',
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
    seo_title: {
      properties: {
        type: 'InputText',
        label: 'SEO Title',
        validations: {
          required: validations.required,
          maxLength: {
            value: 500,
            message: 'Please enter title with maximum 500 characters'
          }
        }
      }
    },
    seo_meta_keywords: {
      properties: {
        type: 'InputText',
        label: 'SEO Meta Keywords',
        validations: {
          required: validations.required,
          maxLength: {
            value: 500,
            message: 'Please enter title with maximum 500 characters'
          }
        }
      }
    },
    seo_meta_description: {
      properties: {
        type: 'InputTextarea',
        label: 'SEO Meta Description',
        validations: {
          required: validations.required,
          maxLength: {
            value: 500,
            message: 'Please enter title with maximum 500 characters'
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

  const formSubmitButtonGroup = () => {
    return (
      <div className="form-button-group">
        <Button type="button" className='p-button p-button-secondary p-mr-2' label="Cancel" onClick={() => { modalPopup.toggle(false) }} />
        {/* <Button type="button" label="Gallery" className="p-button p-button-primary p-mr-2" onClick={() => galleryPopup.toggle(true)} /> */}
        <Button type="submit" label={isEditable ? "Update" : "Create"} className="p-button p-button-primary" />
      </div>
    )
  }

  // form submit 

  const helpFormOnsubmit = (data, error) => {
    let formData = { ...initValue, ...data }
    if (isEmpty(error)) {
      formData = getUserName(isEditable, formData)
      addUpdateHelp(formData)
    }
  }

  // help form section end 

  // add new help 

  const addUpdateHelp = async (data) => {
    if (!isEditable) {
      data.updated_by = data.created_by;
      await response.add({
        service: helpService,
        method: 'addHelp',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: helpService,
        method: 'updateHelp',
        data: { itemId: initValue.page_id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  // add new help 

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={HelpFormFields}
        onFormSubmit={helpFormOnsubmit}
        submitButtonGroup={formSubmitButtonGroup}
      >
      </CityoneDynamicForm>
    </div>
  );

}

export default HelpForm;