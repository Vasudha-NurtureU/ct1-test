import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

//import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { createdDateBadge, statusBadge, customerBadge, packageBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { bulk } from "utils/bulk";

import { getModuleAccess } from "utils/common";

// components
import BookingsForm from 'components/bookings/listing/BookingsForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import BookingsService from 'services/bookings/bookings.service';

class BookingsListing extends Component {

  constructor(props) {

    super(props);

    this.bookingsService = new BookingsService();

    this.bookingsTable = React.createRef(null);

    this.bookingsFormInitValue = {
      transaction_id: null,
      customer_id: null,
      package_id: null,
      travel_date: null,
      sharing_type: null,
      no_of_adult: null,
      no_of_child: null,
      no_of_infant: null,
      status_id: null
    }

    this.state = {

      bookingsForm: {
        isEditable: false,
        initValue: this.formInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Bookings", url: "bookings", },
      ],

      // datatables 

      options: {

        privilege: {
          isActive: true,
          moduleName: getModuleAccess("BOOKINGS"),
        },

        tablePrimeConfig: {
          autoLayout: true,
          lazy: true,
          scrollable: true,
          scrollHeight: "500px",
        },

        url: this.bookingsService,

        method: 'getBookingsList',

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Booking Id',
            field: 'booking_ref_id',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            },
          },
          {
            header: 'Customer',
            field: 'customer_id',
            sortable: true,
            filter: true,
            filterElementOptions: {
              type: 'Dropdown',
              value: "customers",
            },
            headerStyle: {
              width: '150px'
            },
            body: customerBadge,
          },
          {
            header: 'Package',
            field: 'package_id',
            sortable: true,
            filter: true,
            filterType: 'select',
            filterElementOptions: {
              type: 'Dropdown',
              value: "packages",
            },
            headerStyle: {
              width: '200px'
            },
            body: packageBadge,
          },
          {
            header: 'Travel Date',
            field: 'travel_date',
            sortable: true,
            filter: true,
            filterElementOptions: {
              type: 'Calendar',
            },
            headerStyle: {
              width: '150px'
            },
            body: createdDateBadge,
            transformValue: false
          },
          {
            header: 'Status',
            field: 'status_id',
            sortable: true,
            filter: true,
            filterType: 'select',
            filterElementOptions: {
              type: 'Dropdown',
              value: "bookingStatus",
            },
            body: statusBadge,
            headerStyle: {
              width: '120px'
            }
          },
          {
            header: 'Created On',
            field: 'created_at',
            sortable: true,
            filter: true,
            filterElementOptions: {
              type: 'Calendar',
              primeFieldProps: {
                maxDate: new Date()
              },
            },
            body: createdDateBadge,
            headerStyle: {
              width: '120px'
            }
          },
        ],

        actionBtnOptions: [
          {
            type: 'update',
            onClick: this.editBooking,
          },
          // {
          //   type: 'delete',
          //   icon: "uil uil-trash-alt remove-icon",
          //   title: 'Delete Booking',
          //   onClick: (ev, rowdata) => {
          //     confirmDialog.toggle(true);
          //     confirmDialog.accept(() => { this.removeBooking(rowdata.booking_id) });
          //   }
          // },
          {
            type: 'view',
            icon: "pi pi-eye view-icon",
            onClick: (ev, rowdata) => {
              this.viewBooking(rowdata.booking_id)
            }
          },
        ],

        toolBarBtnOptions: {
          title: 'Bookings',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of bookings?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these bookings?" });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              onClick: this.setBookingsFormInitValue
            }
          ]
        },
        enableSelection: true,
      }

      // datatables 
    }
  }

  //bulk update starts
  bulkStatusUpdate = async (selections, status_id) => {
    await bulk.setBulkStatus({
      data: {
        type: "Booking",
        name: "booking_id",
        value: selections.map(value => { return value.booking_id }),
        status_id: status_id,
      },
      dataTable: this.BookingsTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "Booking",
        name: "booking_id",
        value: selections.map(value => { return value.booking_id }),
      },
      dataTable: this.BookingsTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setBookingsFormInitValue = () => {
    this.setState({
      bookingsForm: {
        ...this.state.bookingsForm,
        initValue: this.bookingsFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add boooking', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editBooking = (ev, rowdata) => {

    this.setState({
      bookingsForm: {
        ...this.state.bookingsForm,
        initValue: {
          transaction_id: rowdata.transaction_id,
          booking_id: rowdata.booking_id,
          customer_id: rowdata.customer_id,
          package_id: rowdata.package_id,
          travel_date: rowdata.travel_date? new Date(rowdata.travel_date) : rowdata.travel_date,
          sharing_type: rowdata.sharing_type,
          no_of_adult: rowdata.no_of_adult,
          no_of_child: rowdata.no_of_child,
          no_of_infant: rowdata.no_of_infant,
          pickup_location: rowdata.pickup_location,
          status_id: rowdata.status_id
        },
        isEditable: true
      },
      updateRole:false
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update booking', className: 'sdm-popup' })
      })
  }

  viewBooking = (booking_id) => {
    this.props.history.push(`/bookings/details/${booking_id}`);
  }

  // removeBooking = async (id) => {
  //   await response.remove({
  //     service: this.bookingsService,
  //     method: 'removeBooking',
  //     data: { itemId: id },
  //     dataTable: this.bookingsTable,
  //   })
  // }

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.bookingStatus();
    dropdown.packages();
    dropdown.customers();
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.bookingsTable} options={this.state.options} />
        
        <CityoneModalPopup>
        </CityoneModalPopup><CityoneModalPopup>
          <BookingsForm initialValue={this.state.bookingsForm} dataTableRef={this.bookingsTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(BookingsListing));