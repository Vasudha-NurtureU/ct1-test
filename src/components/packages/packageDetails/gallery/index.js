import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { createdDateBadge, imageBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

//import { modalPopup } from "utils/modalPopup";

import { bulk } from "utils/bulk";

import { getModuleAccess, getUserName } from "utils/common";

import { toaster } from 'utils/toaster';


// components
import GalleryForm from 'components/packages/packageDetails/gallery/GalleryForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import PackageService from 'services/packages/packages.service';

import { galleryPopup } from "utils/galleryPopup";

class Gallery extends Component {

  constructor(props) {

    super(props);

    this.packageService = new PackageService();

    this.galleryTable = React.createRef(null);

    this.galleryFormInitValue = {
      image: null,
      package_id: this.props.packageId,
      created_by: getUserName()
    }

    this.state = {

      galleryForm: {
        isEditable: false,
        initValue: this.galleryFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Packages", url: "packages/listing" },
        { label: "Packages", url: "" },
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

        method: 'getPackageGalleryList',

        params: {
          id: this.props.packageId
        },

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1,
        },

        columns: [
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
            hide: true
          },
          {
            type: 'delete',
            title: 'Delete Image',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeGalleryImage(rowdata.id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Gallery Images',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of images?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these images? This may affect other screens" });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              onClick: this.setGalleryFormInitValue
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
        type: "PackageGallery",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.galleryTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "PackageGallery",
        name: "id",
        value: selections.map(value => { return value.id }),
        deleted_by: getUserName(),
      },
      dataTable: this.galleryTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setGalleryFormInitValue = () => {
    this.setState({
      galleryForm: {
        ...this.state.galleryForm,
        initValue: this.galleryFormInitValue,
        isEditable: false
      }
    },
      () => {
        this.viewGallery();
        // modalPopup.toggle(true)
        // modalPopup.custom({ header: 'add Image', className: 'sdm-popup' })
      })
  }
  // Add User end

  //remove User starts
  removeGalleryImage = async (id) => {
    await response.remove({
      service: this.packageService,
      method: 'deleteGalleryImage',
      data: { itemId: id },
      dataTable: this.galleryTable,
    })
  }
  //remove User end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
  }

   // view galler section starts
   viewGallery = () => {
    this.setState(
      () => {
        galleryPopup.toggle(true);
        galleryPopup.custom({ onAttachmentCopy: (attachment) => { this.addAttachment(attachment) } })
      })
  }

  // add attachment sections starts
  addAttachment = async (attachment) => {
    const data = {
      'package_id': this.props.packageId,
      'image': attachment.file_name,
      'created_by': getUserName()
    }
    const apiResponse = await this.packageService.addGalleryImage(data);
    if (apiResponse && apiResponse.data && !apiResponse.isError) {
      galleryPopup.toggle(false);
      toaster.success("Image added successfully!");
      this.galleryTable.current.loadData();
    } else {
      toaster.error("Error in adding image.")
    }
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.galleryTable} options={this.state.options} />
        
        <CityoneModalPopup>
          <GalleryForm initialValue={this.state.thingsToDoForm} dataTableRef={this.galleryTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(Gallery));