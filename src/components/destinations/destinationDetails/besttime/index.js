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
import BestTimeForm from 'components/destinations/destinationDetails/besttime/BestTimeForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import DestinationsService from 'services/destinations/destinations.service';

class BestTime extends Component {

  constructor(props) {

    super(props);

    this.destinationsService = new DestinationsService();

    this.bestTimeTable = React.createRef(null);

    this.bestTimeFormInitValue = {
      month: null,
      weather: null,
      destination_id: this.props.destinationId,
      created_by: getUserName()
    }

    this.state = {

      bestTimeForm: {
        isEditable: false,
        initValue: this.bestTimeFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Destinations", url: "destinations/listing" },
        { label: "Best Time To Visit", url: "" },
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

        method: 'getDestinationBestTimeList',

        params: {
          id: this.props.destinationId
        },

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Month',
            field: 'month',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Weather',
            field: 'weather',
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
            onClick: this.editBestTime,
          },
          {
            type: 'delete',
            icon: "uil uil-trash-alt remove-icon",
            title: 'Delete Best Time',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeBestTime(rowdata.id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Best Time To Visit',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of best time to visit?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these best time to visit? " });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              onClick: this.setBestTimeFormInitValue
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
        type: "Destinationbesttime",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.BestTimeTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "Destinationbesttime",
        name: "id",
        value: selections.map(value => { return value.id }),
        deleted_by: getUserName(),
      },
      dataTable: this.BestTimeTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setBestTimeFormInitValue = () => {
    this.setState({
      bestTimeForm: {
        ...this.state.bestTimeForm,
        initValue: this.bestTimeFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add Best Time', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editBestTime = (ev, rowdata) => {
    this.setState({
      bestTimeForm: {
        ...this.state.bestTimeForm,
        initValue: {
          id: rowdata.id,
          month: rowdata.month,
          weather: rowdata.weather,
          destination_id: rowdata.destination_id,
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update Best Time', className: 'sdm-popup' })
      })
  }

  //remove User starts
  removeBestTime = async (id) => {
    await response.remove({
      service: this.destinationsService,
      method: 'deleteBestTime',
      data: { itemId: id },
      dataTable: this.bestTimeTable,
    })
  }
  //remove User end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.BestTimeTable} options={this.state.options} />
        
        <CityoneModalPopup>
          <BestTimeForm initialValue={this.state.bestTimeForm} dataTableRef={this.bestTimeTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(BestTime));