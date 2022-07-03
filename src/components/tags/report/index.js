import React, { Component } from "react";

// components
//shared-components
import ReportForm from "shared-components/report";

// utils
import buildBreadcrumb from "utils/breadcrumb";

import { dropdown } from "utils/dropdown";

import { cityAutoCompleteTemplate } from "utils/common";

// services
import UserService from "services/user/user.service";

class UserReport extends Component {

  constructor(props) {

    super(props);

    // variable init start
    this.userService = new UserService();
    // variable init end

    // state management start
    this.state = {

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: "pi pi-home" },
        { label: "User Report", url: "user/report" }
      ],

      initialValues: {},

      options: {

        title: "User Report",

        service: this.userService,

        method: "getUserReport",

        rows: 1000,

        timestampSuffix: "DDMMYYYY",

        fileName: "User_Report",

        columns: [
          {
            label: "Name",
            key: "name"
          },
          {
            label: "Email",
            key: "email_address"
          },
          {
            label: "Phone No",
            key: "contact_number"
          },
          {
            label: "Address",
            key: "address"
          },
          {
            label: "City",
            key: "city"
          },
          {
            label: "State",
            key: "state"
          },
          {
            label: "Country",
            key: "country_name"
          },
          {
            label: "Pincode",
            key: "pincode"
          },
          {
            label: "Status",
            key: "status_name"
          },
          {
            label: "Role",
            key: "label"
          }
        ]

      },

      formFields: {

        from_date: {
          properties: {
            type: "Calendar",
            label: "Registered From",
            fieldWrapperClassNames: "p-md-3",
            primeFieldProps: {
              readOnlyInput: true,
              dateFormat: "M dd, yy",
              maxDate: new Date(),
              showButtonBar: true,
              todayButtonClassName: "p-button-secondary p-ml-2",
              clearButtonClassName: "p-button-secondary p-mr-2"
            }
          }
        },

        to_date: {
          properties: {
            type: "Calendar",
            label: "Registered To",
            fieldWrapperClassNames: "p-md-3",
            primeFieldProps: {
              readOnlyInput: true,
              dateFormat: "M dd, yy",
              maxDate: new Date(),
              showButtonBar: true,
              todayButtonClassName: "p-button-secondary p-ml-2",
              clearButtonClassName: "p-button-secondary p-mr-2"
            }
          }
        },

        city: {
          properties: {
            type: "CityAutoComplete",
            label: "City",
            fieldWrapperClassNames: "p-md-3",
            searchField: "name",
            fieldLabel: "name",
            primeFieldProps: {
              itemTemplate: cityAutoCompleteTemplate
            },
            validations: {
              minLength: {
                value: 3,
                message: "Search value must be minimum 3 character..."
              }
            },
            stateField: {
              label: "State",
              fieldName: "state",
              fieldWrapperClassNames: "p-md-3"
            },
            countryField: {
              label: "Country",
              fieldName: "country_id",
              fieldWrapperClassNames: "p-md-3",
              primeFieldProps: {
                filter: true,
                showClear: true
              },
              dropdownOptions: "country"
            }
          }
        },

        pincode: {
          properties: {
            type: "InputText",
            label: "Pincode",
            fieldWrapperClassNames: "p-md-3",
            validations: {
              maxLength: {
                value: 10,
                message: "Please enter pincode with maximum 10 characters"
              }
            }
          }
        },

        zone_id: {
          properties: {
            type: "SelectDropdown",
            label: "Zone",
            fieldWrapperClassNames: "p-md-3",
            primeFieldProps: { isSearchable: true, isClearable: true },
            dropdownOptions: "zone"
          }
        },

        status_id: {
          properties: {
            type: "Dropdown",
            label: "Status",
            fieldWrapperClassNames: "p-md-3",
            primeFieldProps: { filter: true, showClear: true },
            dropdownOptions: "userStatus"
          }
        },

        role_id: {
          properties: {
            type: "Dropdown",
            label: "Role",
            fieldWrapperClassNames: "p-md-3",
            primeFieldProps: { filter: true, showClear: true },
            dropdownOptions: "roles"
          }
        }
      }
    }
    // state management end
  }

  componentDidMount() {
    buildBreadcrumb(null, this.state.breadcrumbs);
    dropdown.userStatus();
    dropdown.country();
    dropdown.zone();
    dropdown.roles();
  }

  render() {
    return (
      <div>
        <ReportForm fields={this.state.formFields} initialValues={this.state.initialValues} options={this.state.options} />
      </div>
    )
  }
}

export default UserReport;
