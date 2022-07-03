import React, { useState } from "react";

// utils 
import { validations } from 'utils/validations';

import { response } from "utils/response";

import { getUserName } from "utils/common";

import { isEmpty } from 'lodash';

import { modalPopup } from 'utils/modalPopup';

// shared components 
import CityoneDynamicForm from "shared-components/cityone-form/index";

// prime components 
import { Button } from 'primereact/button';

// services 
import DestinationsService from 'services/destinations/destinations.service';

const DestinationsForm = (props) => {

  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;
  const destinationsService = new DestinationsService()
  const [DestinationsFormFields] = useState({
    name: {
      properties: {
        type: 'InputText',
        label: 'Name',
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter title with maximum 120 characters'
          }
        }
      }
    },
    information: {
      properties: {
        type: 'RichTextEditor',
        label: 'Information',
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
    featured: {
      properties: {
        type: 'Dropdown',
        label: 'Featured',
        primeFieldProps: {
          options: [
            {
              label: 'Yes',
              value: 'yes'
            },
            {
              label: 'No',
              value: 'no'
            }
          ]
        },
        validations: {
          required: validations.required,
        }
      }
    },
    show_in_banner: {
      properties: {
        type: 'Dropdown',
        label: 'Show In banner',
        primeFieldProps: {
          options: [
            {
              label: 'Yes',
              value: 'yes'
            },
            {
              label: 'No',
              value: 'no'
            }
          ]
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

  const destinationsFormOnsubmit = (data, error) => {
    let formData = { ...initValue, ...data }
    if (isEmpty(error)) {
      formData = getUserName(isEditable, formData)
      addUpdateDestination(formData)
    }
  }

  const addUpdateDestination = async (data) => {
    if (!isEditable) {
      data.updated_by = data.created_by;
      await response.add({
        service: destinationsService,
        method: 'addDestination',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: destinationsService,
        method: 'updateDestination',
        data: { itemId: initValue.id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={DestinationsFormFields}
        onFormSubmit={destinationsFormOnsubmit}
        submitButtonGroup={formSubmitButtonGroup}
      >
      </CityoneDynamicForm>
    </div>
  );
}

export default DestinationsForm;