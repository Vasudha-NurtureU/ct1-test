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
import SliderForm from 'components/destinations/destinationDetails/slider/SliderForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import DestinationsService from 'services/destinations/destinations.service';

class Slider extends Component {

  constructor(props) {

    super(props);

    this.destinationsService = new DestinationsService();

    this.slidersTable = React.createRef(null);

    this.slidersFormInitValue = {
      title: null,
      description: null,
      status_id: null,
      destination_id: this.props.destinationId,
      created_by: getUserName()
    }

    this.state = {

      slidersForm: {
        isEditable: false,
        initValue: this.slidersFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Destinations", url: "destinations/listing" },
        { label: "Slider", url: "" },
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

        method: 'getDestinationSliderList',

        params: {
          id: this.props.destinationId
        },

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Title',
            field: 'title',
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
            onClick: this.editSlider,
          },
          {
            type: 'delete',
            icon: "uil uil-trash-alt remove-icon",
            title: 'Delete Slider',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeSlider(rowdata.id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Sliders',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of sliders?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these sliders? " });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              onClick: this.setSlidersFormInitValue
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
        type: "DestinationSlider",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.slidersTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "DestinationSlider",
        name: "id",
        value: selections.map(value => { return value.id }),
        deleted_by: getUserName(),
      },
      dataTable: this.slidersTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setSlidersFormInitValue = () => {
    this.setState({
      slidersForm: {
        ...this.state.slidersForm,
        initValue: this.slidersFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add slider', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editSlider = (ev, rowdata) => {
    this.setState({
      slidersForm: {
        ...this.state.slidersForm,
        initValue: {
          id: rowdata.id,
          title: rowdata.title,
          description: rowdata.description,
          status_id: rowdata.status_id,
          destination_id: rowdata.destination_id,
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update Slider', className: 'sdm-popup' })
      })
  }

  //remove User starts
  removeSlider = async (id) => {
    await response.remove({
      service: this.destinationsService,
      method: 'deleteSlider',
      data: { itemId: id },
      dataTable: this.slidersTable,
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
        <CityoneDataTable ref={this.slidersTable} options={this.state.options} />
        
        <CityoneModalPopup>
          <SliderForm initialValue={this.state.slidersForm} dataTableRef={this.slidersTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(Slider));