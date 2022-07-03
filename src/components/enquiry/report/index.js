import React, { Component } from "react";

// components
//shared-components
import ReportForm from "shared-components/report";

// utils
import buildBreadcrumb from "utils/breadcrumb";

import { dropdown } from "utils/dropdown";

// services
import EnquiryService from "services/enquiry/enquiry.service";

class EnquiryReport extends Component {

  constructor(props) {

    super(props);

    // variable init start
    this.enquiryService = new EnquiryService();
    // variable init end

    // state management start
    this.state = {

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: "pi pi-home" },
        { label: "Enquiry Report", url: "enquiry/report" }
      ],

      initialValues: {},

      options: {

        title: "Enquiry Report",

        service: this.enquiryService,

        method: "getEnquiryReport",

        rows: 1000,

        timestampSuffix: "DDMMYYYY",

        fileName: "Enquiry_Report",

        columns: [
          {
            label: "Name",
            key: "full_name"
          },
          {
            label: "Email",
            key: "email_id"
          },
          {
            label: "Found From",
            key: "found_from"
          },
          {
            label: "Contact Number",
            key: "contact_no"
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

        full_name: {
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
  }

  render() {
    return (
      <div>
        <ReportForm fields={this.state.formFields} initialValues={this.state.initialValues} options={this.state.options} />
      </div>
    )
  }
}

export default EnquiryReport;
