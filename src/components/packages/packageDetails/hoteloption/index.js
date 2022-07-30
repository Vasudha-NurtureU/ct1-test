import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { createdDateBadge, statusBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { bulk } from "utils/bulk";

import { getModuleAccess, getUserName } from "utils/common";


// components
import HoteloptionForm from 'components/packages/packageDetails/hoteloption/HoteloptionForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import PackageService from 'services/packages/packages.service';

class Hoteloption extends Component {

  constructor(props) {

    super(props);

    this.packageService = new PackageService();

    this.hoteloptionTable = React.createRef(null);

    this.hoteloptionFormInitValue = {
      data: null,
      type: null,
      status_id: null,
      package_id: this.props.packageId,
      created_by: getUserName()
    }

    this.state = {
      hoteloptionForm: {
        isEditable: false,
        initValue: this.hoteloptionFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Packages", url: "packages/listing" },
        { label: "Manage Hotel options", url: "" },
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

        url: this.packageService,

        method: 'getPackageHoteloptionList',

        params: {
          id: this.props.packageId
        },

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Data',
            field: 'data',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Type',
            field: 'type',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Status',
            field: 'status_id',
            sortable: true,
            filter: true,
            body: statusBadge,
            filterType: 'select',
            filterElementOptions: {
              type: 'Dropdown',
              value: "generalStatus",
            },
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
            onClick: this.editHoteloption,
          },
          {
            type: 'delete',
            icon: "uil uil-trash-alt remove-icon",
            title: 'Delete Hoteloption',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeHoteloption(rowdata.id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Hotel Options',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of hotel options?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these hotel options? " });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              onClick: this.setHoteloptionFormInitValue
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
        type: "PackageHoteloption",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.hoteloptionTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "PackageHoteloption",
        name: "id",
        value: selections.map(value => { return value.id }),
        deleted_by: getUserName(),
      },
      dataTable: this.hoteloptionTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setHoteloptionFormInitValue = () => {
    this.setState({
      hoteloptionForm: {
        ...this.state.hoteloptionForm,
        initValue: this.hoteloptionFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add hotel option', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editHoteloption = (ev, rowdata) => {
    this.setState({
      hoteloptionForm: {
        ...this.state.hoteloptionForm,
        initValue: {
          id: rowdata.id,
          data: rowdata.data,
          type: rowdata.type,
          status_id: rowdata.status_id,
          package_id: rowdata.package_id,
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update Hotel option', className: 'sdm-popup' })
      })
  }

  //remove User starts
  removeHoteloption = async (id) => {
    await response.remove({
      service: this.packageService,
      method: 'deleteHoteloption',
      data: { itemId: id },
      dataTable: this.hoteloptionTable,
    })
  }
  //remove User end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
    dropdown.customers();
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.hoteloptionTable} options={this.state.options} />
        <CityoneModalPopup>
          <HoteloptionForm initialValue={this.state.hoteloptionForm} dataTableRef={this.hoteloptionTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(Hoteloption));