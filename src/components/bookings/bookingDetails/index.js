import React, { Component } from 'react';

import { withRouter } from 'react-router';

// state 
import { connect } from "react-redux";


import { Accordion, AccordionTab } from 'primereact/accordion';

// utils
import { response } from "utils/response";

import buildBreadcrumb from "utils/breadcrumb";

import { dropdown } from 'utils/dropdown';

import { toaster } from 'utils/toaster';

import { getModuleAccess, formatBookingId} from 'utils/common';

// services
import BookingsService from "services/bookings/bookings.service";

class BookingDetails extends Component {

  constructor(props) {

    super(props);

    // variables init start
    this.bookingsService = new BookingsService();

    const bookingModuleAccess = getModuleAccess("BOOKINGS") || {};
    // variables init end

    // state management start
    this.state = {

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Bookings List", url: "bookings/listing" },
        { label: "Booking", url: "" },
      ],

      bookingInfo: null,

     enableCreateProgram: bookingModuleAccess.access ? bookingModuleAccess.access.includes("create") : false,

      bookingID: this.props.match.params.id,

      activeIndex: null
    }
    // state management end
  }

  getBookingsDetail = async () => {

    const apiResponse = await response.get(
      {
        service: this.bookingsService,
        method: 'getBooking',
        data: { itemId: this.state.bookingID }
      });

    if (apiResponse && apiResponse.data) {
      const apiResponseData = apiResponse.data;

      if (!apiResponseData.isError) {

        if (apiResponseData.data) {
          this.setState({ bookingInfo: apiResponseData.data })
          let pageBreadcrumbs = [
            { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
            { label: "Bookings List", url: "bookings/listing" },
            { label: `${apiResponseData.data.label ? apiResponseData.data.label : "Booking"}`, url: "" },
          ];
          buildBreadcrumb(this.props, pageBreadcrumbs)
        }

      } else {
        toaster.error(apiResponseData.message || "Error in fetching booking information")
      }
    }

  }

  componentDidMount = () => {
    buildBreadcrumb(this.props, this.state.breadcrumbs);

    this.getBookingsDetail();
    dropdown.generalStatus();
  }

  render() {
    // state and props destructure start
    const { booking_id, packages, transaction_id, travel_date, sharing_type, no_of_adult, no_of_infant, no_of_child, customer_name, customer_email_address, price, status } = { ...this.state.bookingInfo };
    //const packages = this.state.bookingInfo.package;
    return (
      <>
        <div className='p-card booking-details p-mt-4'>

          <Accordion activeIndex={0} >
            <AccordionTab header="Booking Details" headerClassName="booking-details-header">

              <div className="p-d-flex p-flex-wrap">

              <div className="p-col-md-4 p-col-6 p-mb-3">
                  <p className="p-mb-2">
                    <b>Booking ID</b>
                  </p>
                  <span>{formatBookingId(booking_id)}</span>
                </div>
                <div className="p-col-md-4 p-col-6 p-mb-3">
                  <p className="p-mb-2">
                    <b>Transaction ID</b>
                  </p>
                  <span>{transaction_id}</span>
                </div>

                <div className="p-col-md-4 p-col-6 p-mb-3">
                  <p className="p-mb-2">
                    <b>Package</b>
                  </p>
                  <span>{packages ? packages.name : '-'}</span>
                </div>

                <div className="p-col-md-4 p-col-6 p-mb-3">
                  <p className="p-mb-2">
                    <b>Package Price</b>
                  </p>
                  <span>AED {price ? price : '-'}</span>
                </div>

                <div className="p-col-md-4 p-col-6 p-mb-3">
                  <p className="p-mb-2">
                    <b>Travel Date</b>
                  </p>
                  <span>{travel_date ? travel_date : '-'}</span>
                </div>

                <div className="p-col-md-4 p-col-6 p-mb-3">
                  <p className="p-mb-2">
                    <b>Sharing Type</b>
                  </p>
                  <span>{sharing_type ? sharing_type : '-'}</span>
                </div>

                <div className="p-col-md-4 p-col-6 p-mb-3">
                  <p className="p-mb-2">
                    <b>No Of Adults</b>
                  </p>
                  <span>{no_of_adult ? no_of_adult : '-'}</span>
                </div>

                <div className="p-col-md-4 p-col-6 p-mb-3">
                  <p className="p-mb-2">
                    <b>No Of Childs</b>
                  </p>
                  <span>{no_of_child  ? no_of_child : '-'}</span>
                </div>
               
                <div className="p-col-md-4 p-col-6 p-mb-3">
                  <p className="p-mb-2">
                    <b>No Of Infants</b>
                  </p>
                  <span>{no_of_infant ? no_of_infant : '-'}</span>
                </div>
                <div className="p-col-md-4 p-col-6 p-mb-3">
                  <p className="p-mb-2">
                    <b>Status</b>
                  </p>
                  <span>{status ? status.status_name : '-'}</span>
                </div>

              </div>

              <div className="p-d-flex p-flex-wrap">
                <div className="p-col-md-4 p-col-6 p-mb-3">
                  <h4>Customer Details</h4>
                </div>
              </div>

              <div className="p-d-flex p-flex-wrap">
                <div className="p-col-md-4 p-col-6 p-mb-3">
                    <p className="p-mb-2">
                      <b>Name</b>
                    </p>
                    <span>{customer_name}</span>
                  </div>
                  <div className="p-col-md-4 p-col-6 p-mb-3">
                    <p className="p-mb-2">
                      <b>Email Address</b>
                    </p>
                    <span>{customer_email_address}</span>
                  </div>
              </div>

            </AccordionTab>
          </Accordion>

        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  zones: state.dropdownDetails.zone,
});

export default withRouter(connect(mapStateToProps)(BookingDetails));