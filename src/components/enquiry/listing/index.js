import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { createdDateBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { bulk } from "utils/bulk";

import { getModuleAccess } from "utils/common";

// components
import EnquiryForm from 'components/enquiry/listing/EnquiryForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import EnquiryService from 'services/enquiry/enquiry.service';

class EnquiryListing extends Component {

  constructor(props) {

    super(props);

    this.enquiryService = new EnquiryService();

    this.enquiryTable = React.createRef(null);

    this.enquiryFormInitValue = {
      full_name: null,
      email_id: null,
      enquiry_item: null,
      found_from: null,
      contact_no: null,
      description: null,
      status_id: null,
    }

    this.state = {

      enquiryForm: {
        isEditable: false,
        initValue: this.formInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Enquiry", url: "enquiry", },
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

        url: this.enquiryService,

        method: 'getEnquiryList',

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Name',
            field: 'full_name',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Email',
            field: 'email_id',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '200px'
            },
            transformValue: false
          },
          {
            header: 'Found From',
            field: 'found_from',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '200px'
            },
            transformValue: false
          },
          {
            header: 'Contact Number',
            field: 'contact_no',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '200px'
            },
            transformValue: false
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
            title: 'View Enquiry',
            onClick: this.editEnquiry,
            icon: "pi pi-eye view-icon",
          },
          {
            type: 'delete',
            icon: "uil uil-trash-alt remove-icon",
            title: 'Delete Enquiry',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeEnquiry(rowdata.id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Enquires',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of enquires?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these enquires? " });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              visibility: false,
              onClick: this.setEnquiryFormInitValue
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
        type: "Enquiry",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
      },
      dataTable: this.enquiryTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "Enquiry",
        name: "id",
        value: selections.map(value => { return value.id }),
      },
      dataTable: this.enquiryTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setEnquiryFormInitValue = () => {
    this.setState({
      enquiryForm: {
        ...this.state.enquiryForm,
        initValue: this.enquiryFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add enquiry', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editEnquiry = (ev, rowdata) => {
    this.setState({
      enquiryForm: {
        ...this.state.enquiryForm,
        initValue: {
          id: rowdata.id,
          full_name: rowdata.full_name,
          email_id: rowdata.email_id,
          enquiry_item: rowdata.enquiry_item,
          found_from: rowdata.found_from,
          contact_no: rowdata.contact_no,
          description: rowdata.description,
          status_id: rowdata.status_id,
        },
        isEditable: true
      },
      updateRole:false
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'View enquiry', className: 'sdm-popup' })
      })
  }

  //remove User starts
  removeEnquiry = async (id) => {
    await response.remove({
      service: this.enquiryService,
      method: 'removeEnquiry',
      data: { itemId: id },
      dataTable: this.enquiryTable,
    })
  }
  //remove User end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.enquiryTable} options={this.state.options} />
        
        <CityoneModalPopup></CityoneModalPopup>
        <CityoneModalPopup>
          <EnquiryForm initialValue={this.state.enquiryForm} dataTableRef={this.enquiryTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(EnquiryListing));