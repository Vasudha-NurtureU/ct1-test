import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { createdDateBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { bulk } from "utils/bulk";

import { getModuleAccess, getUserName } from "utils/common";


// components
import UsefulinfoForm from 'components/destinations/destinationDetails/usefulinfo/UsefulinfoForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import DestinationsService from 'services/destinations/destinations.service';

class Usefulinfo extends Component {

  constructor(props) {

    super(props);

    this.destinationsService = new DestinationsService();

    this.usefulinfoTable = React.createRef(null);

    this.usefulinfoFormInitValue = {
      language: null,
      currency: null,
      timeZone: null,
      best_time_travel: null,
      destination_id: this.props.destinationId,
      created_by: getUserName()
    }

    this.state = {

      usefulinfoForm: {
        isEditable: false,
        initValue: this.usefulinfoFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Destinations", url: "destinations/listing" },
        { label: "Useful Info", url: "" },
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

        url: this.destinationsService,

        method: 'getDestinationUsefulInfoList',

        params: {
          id: this.props.destinationId
        },

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Language',
            field: 'language',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Currency',
            field: 'currency',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Time Zone',
            field: 'timeZone',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Best Time To Travel',
            field: 'best_time_travel',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
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
            onClick: this.editUsefulinfo,
          },
          {
            type: 'delete',
            icon: "uil uil-trash-alt remove-icon",
            title: 'Delete Useful Info',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeUsefulinfo(rowdata.id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Useful Info',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of useful info?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these useful info? " });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              onClick: this.setUsefulinfoFormInitValue
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
        type: "Destinationusefulinfo",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.usefulinfoTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "Destinationusefulinfo",
        name: "id",
        value: selections.map(value => { return value.id }),
        deleted_by: getUserName(),
      },
      dataTable: this.usefulinfoTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setUsefulinfoFormInitValue = () => {
    this.setState({
      usefulinfoForm: {
        ...this.state.usefulinfoForm,
        initValue: this.usefulinfoFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add Useful info', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editUsefulinfo = (ev, rowdata) => {
    this.setState({
      usefulinfoForm: {
        ...this.state.usefulinfoForm,
        initValue: {
          id: rowdata.id,
          language: rowdata.language,
          currency: rowdata.currency,
          timeZone: rowdata.timeZone,
          best_time_travel: rowdata.best_time_travel,
          destination_id: rowdata.destination_id,
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update Useful Info', className: 'sdm-popup' })
      })
  }

  //remove User starts
  removeUsefulinfo = async (id) => {
    await response.remove({
      service: this.destinationsService,
      method: 'deleteUsefulInfo',
      data: { itemId: id },
      dataTable: this.usefulinfoTable,
    })
  }
  //remove User end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.usefulinfoTable} options={this.state.options} />
        
        <CityoneModalPopup>
          <UsefulinfoForm initialValue={this.state.usefulinfoForm} dataTableRef={this.usefulinfoTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(Usefulinfo));