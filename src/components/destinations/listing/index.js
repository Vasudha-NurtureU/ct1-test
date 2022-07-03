import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { bulk } from "utils/bulk";

import { statusBadge, imageBadge, bannerImageBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { getModuleAccess, getUserName } from "utils/common";
import { toaster } from 'utils/toaster';

// components
import DestinationsForm from 'components/destinations/listing/DestinationsForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import DestinationsService from 'services/destinations/destinations.service';

import { galleryPopup } from "utils/galleryPopup";

class DestinationsListing extends Component {

  constructor(props) {

    super(props);

    // variable inti starts
    this.destinationsService = new DestinationsService();

    this.destinationsTable = React.createRef(null);

    this.destinationsFormInitValue = {
      name: null,
      information: null,
      featured: null,
      show_in_banner: null,
      seo_title: null,
      seo_meta_description: null,
      seo_meta_keywords: null,
      status_id: null
    };

    // variable inti end

    this.state = {

      destinationsForm: {
        isEditable: false,
        initValue: this.destinationsFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Destinations", url: "destinations", },
      ],

      // datatable

      options: {

        privilege: {
          isActive: true,
          moduleName: getModuleAccess("CMS"),
        },

        tablePrimeConfig: {
          autoLayout: true,
          lazy: true
        },

        url: this.destinationsService,

        method: 'getDestinationsList',

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Name',
            field: 'name',
            sortable: true,
            filter: true
          },
          {
            header: 'Listing Image',
            field: 'image',
            sortable: true,
            filter: true,
            body: imageBadge,
          },
          {
            header: 'Banner Image',
            field: 'banner_image',
            sortable: true,
            filter: true,
            body: bannerImageBadge,
          },
          {
            header: 'Featured',
            field: 'featured',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '80px'
            },
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
              value: "generalStatus"
            }
          }
        ],

        actionBtnOptions: [
          {
            type: 'update',
            onClick: this.editDestinations
          },
          {
            type: 'delete',
            onClick: (ev, rowData) => {
              confirmDialog.toggle(true)
              confirmDialog.custom({
                message: "Are you sure you want to delete this destination?",
                accept: () => { this.removeDestination(rowData.id) }
              });
            }
          },
          {
            type: 'destinationOptions',
            title: 'Destination Options',
            onClick: (ev, rowdata) => {
              this.manageDestination(rowdata.id)
            },
            icon: "pi pi-th-large view-icon",
          },
          {
            type: 'Destination Image',
            title: 'Destination Listing Image',
            onClick: (ev, rowdata) => {
              this.viewGallery(rowdata, 'image');
            },
            icon: "uil uil-image view-icon",
          },
          {
            type: 'Destination Image',
            title: 'Destination Banner Image',
            onClick: (ev, rowdata) => {
              this.viewGallery(rowdata, 'banner-image');
            },
            icon: "uil uil-image-plus view-icon",
          }
        ],

        toolBarBtnOptions: {
          title: 'Destinations',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true)
                confirmDialog.custom({
                  message: "You are about to mass update the status of destination?",
                  accept: () => { this.bulkStatusUpdate(selections, status) }
                });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true)
                confirmDialog.custom({
                  message: "You are about to mass delete destinations?",
                  accept: () => { this.bulkDelete(selections) }
                });
              }
            },
          },
          rightBtnsOptions: [
            { onClick: this.setDestinationsFormInitValue }
          ]
        },
        enableSelection: true,
      }
    }
  }
  // bulk status update section starts
  bulkStatusUpdate = async (selections, status_id) => {
    await bulk.setBulkStatus({
      data: {
        type: "Destination",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.destinationsTable,
    })
  }
  // bulk status update section end

  // bulk delete section starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "Destination",
        name: "id",
        value: selections.map(value => { return value.id }),
        deleted_by: getUserName(),
      },
      dataTable: this.destinationsTable,
    })
  }
  // bulk delete section ends

  // CMS Help Form Init Value section starts
  setDestinationsFormInitValue = () => {
    this.setState({
      destinationsForm: {
        ...this.state.destinationsForm,
        initValue: this.destinationsFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add destination', className: 'cms-popup' })
      })
  }
  // CMS Help Form Init Value section end

  // Edit Help starts
  editDestinations = (ev, rowdata) => {
    this.setState({
      destinationsForm: {
        ...this.state.destinationsForm,
        initValue: {
          id: rowdata.id,
          name: rowdata.name,
          information: rowdata.information,
          featured: rowdata.featured,
          show_in_banner: rowdata.show_in_banner,
          seo_title: rowdata.seo_title,
          seo_meta_description: rowdata.seo_meta_description,
          seo_meta_keywords: rowdata.seo_meta_keywords,
          status_id: rowdata.status_id
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'update destination', className: 'cms-popup' })
      })
  }

  manageDestination = (booking_id) => {
    this.props.history.push(`/destinations/details/${booking_id}`);
  }

  // Remove Help starts
  removeDestination = async (id) => {
    await response.remove({
      service: this.destinationsService,
      method: 'removeDestination',
      data: { itemId: id },
      dataTable: this.destinationsTable,
    })
  }

  // Removedit Help end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
  }

  viewGallery = (rowData, imageType) => {
    this.setState({ processingModule: rowData, imageType },
      () => {
        galleryPopup.toggle(true);
        galleryPopup.custom({ onAttachmentCopy: (attachment) => { this.addAttachment(attachment) } })
    })
  }

  addAttachment = async (attachment) => {
    let image;
    if (this.state.imageType === 'image') {
      image = { 'image': attachment.file_name };
    } else {
      image = { 'banner_image': attachment.file_name };
    }
    let apiResponse = await this.destinationsService.updatePackageImages(this.state.processingModule.id, image);
    if (apiResponse && apiResponse.data && !apiResponse.isError) {
      galleryPopup.toggle(false);
      toaster.success("Image added successfully!");
      this.destinationsTable.current.loadData();
    } else {
      toaster.error("Error in adding image.")
    }
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.destinationsTable} options={this.state.options} />
        <CityoneModalPopup>
          <DestinationsForm initialValue={this.state.destinationsForm} dataTableRef={this.destinationsTable} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(DestinationsListing));