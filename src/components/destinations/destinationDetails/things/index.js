import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { createdDateBadge, statusBadge, imageBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { bulk } from "utils/bulk";

import { getModuleAccess, getUserName } from "utils/common";

import { toaster } from 'utils/toaster';

// components
import ThingsToDoForm from 'components/destinations/destinationDetails/things/ThingsToDoForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import DestinationsService from 'services/destinations/destinations.service';

import { galleryPopup } from "utils/galleryPopup";

class ThingsToDo extends Component {

  constructor(props) {

    super(props);

    this.destinationsService = new DestinationsService();

    this.thingsToDoTable = React.createRef(null);

    this.thingsToDoFormInitValue = {
      title: null,
      image: null,
      description: null,
      status_id: null,
      destination_id: this.props.destinationId,
      created_by: getUserName()
    }

    this.state = {

      thingsToDoForm: {
        isEditable: false,
        initValue: this.thingsToDoFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Destinations", url: "destinations/listing" },
        { label: "Things To Do", url: "" },
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

        method: 'getDestinationThingsToDoList',

        params: {
          id: this.props.destinationId
        },

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1,
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
            header: 'Image',
            field: 'image',
            sortable: true,
            filter: true,
            body: imageBadge,
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
            onClick: this.editThingsToDo,
          },
          {
            title: 'Image',
            icon: "uil uil-image-plus edit-icon",
            onClick: (ev, rowdata) => {
             this.viewGallery(rowdata);
            }
          },
          {
            type: 'delete',
            icon: "uil uil-trash-alt remove-icon",
            title: 'Delete ThingsToDo',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeThingsToDo(rowdata.id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'ThingsToDo',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of thingsToDo?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these thingsToDo? " });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              onClick: this.setThingsToDoFormInitValue
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
        type: "DestinationThingstodo",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.thingsToDoTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "DestinationThingstodo",
        name: "id",
        value: selections.map(value => { return value.id }),
        deleted_by: getUserName(),
      },
      dataTable: this.thingsToDoTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setThingsToDoFormInitValue = () => {
    this.setState({
      thingsToDoForm: {
        ...this.state.thingsToDoForm,
        initValue: this.thingsToDoFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add ThingsToDo', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editThingsToDo = (ev, rowdata) => {
    this.setState({
      thingsToDoForm: {
        ...this.state.thingsToDoForm,
        initValue: {
          id: rowdata.id,
          title: rowdata.title,
          image: rowdata.image,
          description: rowdata.description,
          status_id: rowdata.status_id,
          destination_id: rowdata.destination_id,
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update ThingsToDo', className: 'sdm-popup' })
      })
  }

  //remove User starts
  removeThingsToDo = async (id) => {
    await response.remove({
      service: this.destinationsService,
      method: 'deleteThingsToDo',
      data: { itemId: id },
      dataTable: this.thingsToDoTable,
    })
  }
  //remove User end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
  }

   // view galler section starts
   viewGallery = (rowData) => {
    this.setState({ processingModule: rowData },
      () => {
        galleryPopup.toggle(true);
        galleryPopup.custom({ onAttachmentCopy: (attachment) => { this.addAttachment(attachment) } })
      })
  }

  // add attachment sections starts
  addAttachment = async (attachment) => {
    let apiResponse = await  this.destinationsService.updateThingsToDoImage(this.state.processingModule.id, {'image': attachment.file_name});
    
    if (apiResponse && apiResponse.data && !apiResponse.isError) {
      galleryPopup.toggle(false);
      toaster.success("Image added successfully!");
      this.thingsToDoTable.current.loadData();
    } else {
      toaster.error("Error in adding image.")
    }
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.thingsToDoTable} options={this.state.options} />
        
        <CityoneModalPopup>
          <ThingsToDoForm initialValue={this.state.thingsToDoForm} dataTableRef={this.thingsToDoTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(ThingsToDo));