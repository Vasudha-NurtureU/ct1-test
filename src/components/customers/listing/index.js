import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { createdDateBadge, statusBadge, countryBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { bulk } from "utils/bulk";

import { getModuleAccess } from "utils/common";

// components
import CustomersForm from 'components/customers/listing/CustomersForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import CustomersService from 'services/customers/customers.service';

class CustomersListing extends Component {

  constructor(props) {

    super(props);

    this.customersService = new CustomersService();

    this.customersTable = React.createRef(null);

    this.customersFormInitValue = {
      name: null,
      email_addess: null,
      contact_number: null,
      city: null,
      country: null,
      status_id: null,
    }

    this.state = {

      customersForm: {
        isEditable: false,
        initValue: this.formInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Customers", url: "customers", },
      ],

      // datatables 

      options: {

        privilege: {
          isActive: true,
          moduleName: getModuleAccess("USER"),
        },

        tablePrimeConfig: {
          autoLayout: true,
          lazy: true,
          scrollable: true,
          scrollHeight: "500px",
        },

        url: this.customersService,

        method: 'getCustomersList',

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Name',
            field: 'first_name',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Email',
            field: 'email_address',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '200px'
            },
            transformValue: false
          },
          {
            header: 'Contact Number',
            field: 'contact_number',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '200px'
            },
            transformValue: false
          },
          {
            header: 'Country',
            field: 'country_id',
            sortable: true,
            filter: true,
            filterType: 'select',
            filterElementOptions: {
              type: 'Dropdown',
              value: "country",
            },
            body: countryBadge,
            headerStyle: {
              width: '120px'
            }
          },
          {
            header: 'Status',
            field: 'status_id',
            sortable: true,
            filter: true,
            filterType: 'select',
            filterElementOptions: {
              type: 'Dropdown',
              value: "generalStatus",
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
            onClick: this.editCustomer,
          },
          {
            type: 'delete',
            icon: "uil uil-trash-alt remove-icon",
            title: 'Delete Customer',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeCustomer(rowdata.customer_id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Customers',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of customers?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these customers?" });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              visibility: false,
              onClick: this.setCustomersFormInitValue
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
        type: "Customer",
        name: "customer_id",
        value: selections.map(value => { return value.customer_id }),
        status_id: status_id,
      },
      dataTable: this.customersTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "Customer",
        name: "customer_id",
        value: selections.map(value => { return value.customer_id }),
      },
      dataTable: this.customersTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setCustomersFormInitValue = () => {
    this.setState({
      customersForm: {
        ...this.state.customersForm,
        initValue: this.customersFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add customer', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editCustomer = (ev, rowdata) => {
    this.setState({
      customersForm: {
        ...this.state.customersForm,
        initValue: {
          customer_id: rowdata.customer_id,
          first_name: rowdata.first_name,
          last_name: rowdata.last_name,
          email_address: rowdata.email_address,
          contact_number: rowdata.contact_number,
          city: rowdata.city,
          country_id: rowdata.country_id,
          status_id: rowdata.status_id,
        },
        isEditable: true
      },
      updateRole:false
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update customer', className: 'sdm-popup' })
      })
  }

  //remove User starts
  removeCustomer = async (id) => {
    await response.remove({
      service: this.customersService,
      method: 'removeCustomer',
      data: { itemId: id },
      dataTable: this.customersTable,
    })
  }
  //remove User end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
    dropdown.country();
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.customersTable} options={this.state.options} />
        
        <CityoneModalPopup>
        </CityoneModalPopup><CityoneModalPopup>
          <CustomersForm initialValue={this.state.customersForm} dataTableRef={this.customersTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(CustomersListing));