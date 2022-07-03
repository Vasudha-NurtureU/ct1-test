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


// components
import ItineraryForm from 'components/packages/packageDetails/itinerary/ItineraryForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import PackageService from 'services/packages/packages.service';

import { galleryPopup } from "utils/galleryPopup";

import { toaster } from 'utils/toaster';


class Itinerary extends Component {

  constructor(props) {

    super(props);

    this.packageService = new PackageService();

    this.itinearyTable = React.createRef(null);

    this.itinearyFormInitValue = {
      title: null,
      description: null,
      status_id: null,
      package_id: this.props.packageId,
      created_by: getUserName()
    }

    this.state = {

      itinearyForm: {
        isEditable: false,
        initValue: this.itinearyFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Packages", url: "packages/listing" },
        { label: "Manage Itinerary", url: "" },
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

        method: 'getPackageItinearyList',

        params: {
          id: this.props.packageId
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
            onClick: this.editItineary,
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
            title: 'Delete Itineary',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeItineary(rowdata.id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Itinerary',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of itinearies?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these itinearies? This may affect other screens" });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              onClick: this.setItinearyFormInitValue
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
        type: "PackageItineary",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.itinearyTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "PackageItineary",
        name: "id",
        value: selections.map(value => { return value.id }),
        deleted_by: getUserName(),
      },
      dataTable: this.itinearyTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setItinearyFormInitValue = () => {
    this.setState({
      itinearyForm: {
        ...this.state.itinearyForm,
        initValue: this.itinearyFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add itineary', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editItineary = (ev, rowdata) => {
    this.setState({
      itinearyForm: {
        ...this.state.itinearyForm,
        initValue: {
          id: rowdata.id,
          title: rowdata.title,
          description: rowdata.description,
          status_id: rowdata.status_id,
          package_id: rowdata.package_id,
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update Itineary', className: 'sdm-popup' })
      })
  }

  //remove User starts
  removeItineary = async (id) => {
    await response.remove({
      service: this.packageService,
      method: 'deleteItineary',
      data: { itemId: id },
      dataTable: this.itinearyTable,
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
    const apiResponse = await this.packageService.updateItinearyImage(this.state.processingModule.id, {'image': attachment.file_name});
    if (apiResponse && apiResponse.data && !apiResponse.isError) {
      galleryPopup.toggle(false);
      toaster.success("Image added successfully!");
      this.itinearyTable.current.loadData();
    } else {
      toaster.error("Error in adding image.")
    }
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.itinearyTable} options={this.state.options} />
        <CityoneModalPopup>
          <ItineraryForm initialValue={this.state.itinearyForm} dataTableRef={this.itinearyTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(Itinerary));