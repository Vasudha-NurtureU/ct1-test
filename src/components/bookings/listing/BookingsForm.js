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
import BookingsService from 'services/bookings/bookings.service';

const BookingsForm = (props) => {
  // props destructure start
  const { initialValue, dataTableRef } = props
  const { initValue, isEditable } = initialValue;

  //const editable = getUserPrivilagesAccess()
  // props destructure end

  // variable init start 
  const bookingsService = new BookingsService();



  // state management start

  // validations start

  // user form section start 

  // validations 

  const [BookingsFormFields] = useState({

    transaction_id: {
      properties: {
        type: 'InputText',
        label: 'Transaction Id',
        readonly: true,
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter transactionID with maximum 120 characters'
          },
        }
      }
    },
    customer_id: {
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
    package_id: {
      properties: {
        type: 'Dropdown',
        label: 'Package',
        dropdownOptions: "packages",
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter name with maximum 120 characters'
          },
        }
      }
    },
    travel_date: {
      properties: {
        type: 'Calendar',
        label: 'Travel Date',
        validations: {
          required: validations.required,
        }
      }
    },
    sharing_type: {
      properties: {
        type: 'InputText',
        label: 'Sharing Type',
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter name with maximum 120 characters'
          },
        }
      }
    },
    no_of_adult: {
      properties: {
        type: 'InputText',
        label: 'No Of Adults',
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter name with maximum 120 characters'
          },
        }
      }
    },
    no_of_child: {
      properties: {
        type: 'InputText',
        label: 'No Of Childs',
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter name with maximum 120 characters'
          },
        }
      }
    },
    no_of_infant: {
      properties: {
        type: 'InputText',
        label: 'No Of Infant',
        validations: {
          required: validations.required,
          maxLength: {
            value: 120,
            message: 'Please enter name with maximum 120 characters'
          },
        }
      }
    },
    pickup_location: {
      properties: {
        type: 'InputText',
        label: 'Pickup location',
        validations: {
          required: validations.required,
          maxLength: {
            value: 200,
            message: 'Please enter name with maximum 200 characters'
          },
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
        dropdownOptions: "bookingStatus"
      }
    },
  });

  // form submit 
  const BookingsFormFieldsonUpdate = {
    transaction_id: BookingsFormFields.transaction_id,
    customer_id: BookingsFormFields.customer_id,
    package_id: BookingsFormFields.package_id,
    travel_date: BookingsFormFields.travel_date,
    sharing_type: BookingsFormFields.sharing_type,
    no_of_adult: BookingsFormFields.no_of_adult,
    no_of_child: BookingsFormFields.no_of_child,
    no_of_infant: BookingsFormFields.no_of_infant,
    pickup_location: BookingsFormFields.pickup_location,
    status_id: BookingsFormFields.status_id
  }

  const BookingsFormFieldsOnAdd = {
    transaction_id: BookingsFormFields.transaction_id,
    customer_id: BookingsFormFields.customer_id,
    package_id: BookingsFormFields.package_id,
    travel_date: BookingsFormFields.travel_date,
    sharing_type: BookingsFormFields.sharing_type,
    no_of_adult: BookingsFormFields.no_of_adult,
    no_of_child: BookingsFormFields.no_of_child,
    no_of_infant: BookingsFormFields.no_of_infant,
    pickup_location: BookingsFormFields.pickup_location,
    status_id: BookingsFormFields.status_id
  }

  const BookingsFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      let formData = { ...initValue, ...data }
      addUpdateBookings(formData)
    }
  }

  // form submit section 

  const BookingsFormSubmitButtonGroup = () => {
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

  const addUpdateBookings = async (data) => {
    if (!isEditable) {
      await response.add({
        service: bookingsService,
        method: 'addBooking',
        data: { item: data },
        dataTable: dataTableRef,
      })
    } else {
      await response.update({
        service: bookingsService,
        method: 'updateBooking',
        data: { itemId: initValue.booking_id, item: data },
        dataTable: dataTableRef,
      })
    }
  }

  return (
    <div>
      <CityoneDynamicForm
        initialValues={initValue}
        fields={!isEditable ? BookingsFormFieldsOnAdd : BookingsFormFieldsonUpdate}
        onFormSubmit={BookingsFormOnsubmit}
        submitButtonGroup={BookingsFormSubmitButtonGroup}
      />
    </div>
  );

}

export default BookingsForm;
