import React, { Component } from "react";

// components
//shared-components
import ReportForm from "shared-components/report";

// utils
import buildBreadcrumb from "utils/breadcrumb";

import { dropdown } from "utils/dropdown";

// services
import CustomersService from "services/customers/customers.service";

class CustomerReport extends Component {

  constructor(props) {

    super(props);

    // variable init start
    this.customersService = new CustomersService();
    // variable init end

    // state management start
    this.state = {

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: "pi pi-home" },
        { label: "Customer Report", url: "customer/report" }
      ],

      initialValues: {},

      options: {

        title: "Customer Report",

        service: this.customersService,

        method: "getCustomerReport",

        rows: 1000,

        timestampSuffix: "DDMMYYYY",

        fileName: "Customer_Report",

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
            label: "Contact Number",
            key: "contact_number"
          },
          {
            label: "City",
            key: "city"
          },
          {
            label: "Created At",
            key: "created_at"
          },
          {
            label: "Status",
            key: "status_name"
          }
        ]
      },

      formFields: {
        name: {
          properties: {
            type: "InputText",
            label: "Name",
            fieldWrapperClassNames: "p-md-3",
            validations: {
              maxLength: {
                value: 120,
                message: "Please enter a name."
              }
            }
          }
        },
        country_id: {
          properties: {
            type: 'Dropdown',
            label: 'Country',
            fieldWrapperClassNames: "p-md-3",
            primeFieldProps: {
            },
            dropdownOptions: "country"
          }
        },
        from_date: {
          properties: {
            type: 'Calendar',
            label: 'From Date',
            fieldWrapperClassNames: "p-md-3",
          }
        },
        to_date: {
          properties: {
            type: 'Calendar',
            label: 'To Date',
            fieldWrapperClassNames: "p-md-3",
          }
        },
        status_id: {
          properties: {
            type: "Dropdown",
            label: "Status",
            fieldWrapperClassNames: "p-md-3",
            primeFieldProps: { filter: true, showClear: true },
            dropdownOptions: "generalStatus"
          }
        }
      }
    }
    // state management end
  }

  componentDidMount() {
    buildBreadcrumb(null, this.state.breadcrumbs);
    dropdown.generalStatus();
    dropdown.country();
  }

  render() {
    return (
      <div>
        <ReportForm fields={this.state.formFields} initialValues={this.state.initialValues} options={this.state.options} />
      </div>
    )
  }
}

export default CustomerReport;
