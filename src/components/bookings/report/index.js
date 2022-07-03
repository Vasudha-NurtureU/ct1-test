import React, { Component } from "react";

// components
//shared-components
import ReportForm from "shared-components/report";

// utils
import buildBreadcrumb from "utils/breadcrumb";

import { dropdown } from "utils/dropdown";

// services
import BookingsService from "services/bookings/bookings.service";

class BookingReport extends Component {

  constructor(props) {

    super(props);

    // variable init start
    this.bookingsService = new BookingsService();
    // variable init end

    // state management start
    this.state = {

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: "pi pi-home" },
        { label: "Booking Report", url: "booking/report" }
      ],

      initialValues: {},

      options: {

        title: "Booking Report",

        service: this.bookingsService,

        method: "geBookingReport",

        rows: 1000,

        timestampSuffix: "DDMMYYYY",

        fileName: "Booking_Report",

        columns: [
          {
            label: "Booking Id",
            key: "booking_id"
          },
          {
            label: "Transaction Id",
            key: "transaction_id"
          },
          {
            label: "Customer",
            key: "customer_id"
          },
          {
            label: "Package",
            key: "package_id"
          },
          {
            label: "Travel Date",
            key: "travel_date"
          },
          {
            label: "Sharing Type",
            key: "sharing_type"
          },
          {
            label: "No Of Adults",
            key: "no_of_adult"
          },
          {
            label: "No Of Child",
            key: "no_of_child"
          },
          {
            label: "No Of Infant",
            key: "no_of_infant"
          },
          {
            label: "Pickup Location",
            key: "pickup_location"
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

        package_id: {
          properties: {
            type: "Dropdown",
            label: "Package",
            fieldWrapperClassNames: "p-md-3",
            primeFieldProps: { filter: true, showClear: true },
            dropdownOptions: "packages"
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
            dropdownOptions: "bookingStatus"
          }
        }
      }
    }
    // state management end
  }

  componentDidMount() {
    buildBreadcrumb(null, this.state.breadcrumbs);
    dropdown.bookingStatus();
    dropdown.packages();
  }

  render() {
    return (
      <div>
        <ReportForm fields={this.state.formFields} initialValues={this.state.initialValues} options={this.state.options} />
      </div>
    )
  }
}

export default BookingReport;
