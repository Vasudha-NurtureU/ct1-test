import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { bulk } from "utils/bulk";

import { statusBadge, destinationBadge, imageBadge, bannerImageBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { getModuleAccess, getUserName } from "utils/common";

// components
import PackagesForm from 'components/packages/listing/PackagesForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import PackagesService from 'services/packages/packages.service';

import { galleryPopup } from "utils/galleryPopup";
import appStore from 'store/index';
import { toaster } from "utils/toaster";

class PackagesListing extends Component {

  constructor(props) {

    super(props);

    // variable inti starts
    this.packagesService = new PackagesService();

    this.packagesTable = React.createRef(null);

    this.packagesFormInitValue = {
      name: null,
      destination_id: null,
      description: null,
      information: null,
      featured: null,
      show_in_banner: null,
      country_id: null,
      tags: null,
      tag_categories: null,
      area: null,
      price: null,
      seo_title: null,
      seo_meta_description: null,
      seo_meta_keywords: null,
      status_id: null
    };

    // variable inti end

    this.state = {

      packagesForm: {
        isEditable: false,
        initValue: this.packagesFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Packages", url: "packages", },
      ],

      // datatable

      options: {

        privilege: {
          isActive: true,
          moduleName: getModuleAccess("PACKAGES"),
        },

        tablePrimeConfig: {
          autoLayout: true,
          lazy: true
        },

        url: this.packagesService,

        method: 'getPackagesList',

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
            header: 'Destination',
            field: 'destination_id',
            sortable: true,
            filter: true,
            filterType: 'select',
            filterElementOptions: {
              type: 'Dropdown',
              value: "destinations",
            },
            body: destinationBadge,
            headerStyle: {
              width: '120px'
            }
          },
          {
            header: 'Featured',
            field: 'featured',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '50px'
            },
          },
          {
            header: 'Enable Booking',
            field: 'is_book_now_enabled',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '50px'
            },
          },
          {
            header: 'Status',
            field: 'status_id',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '80px'
            },
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
            title: 'Update Package',
            onClick: this.editPackages,
            icon: "pi pi-pencil view-icon",
          },
          {
            type: 'delete',
            onClick: (ev, rowData) => {
              confirmDialog.toggle(true)
              confirmDialog.custom({
                message: "Are you sure you want to delete this package?",
                accept: () => { this.removePackages(rowData.id) }
              });
            }
          },
          {
            type: 'packageOptions',
            title: 'Package Options',
            onClick: (ev, rowdata) => {
              this.managePackages(rowdata.id)
            },
            icon: "pi pi-th-large view-icon",
          },
          {
            type: 'Package Image',
            title: 'Package Listing Image',
            onClick: (ev, rowdata) => {
              this.viewGallery(rowdata, 'image');
            },
            icon: "uil uil-image view-icon",
          },
          {
            type: 'package Banner Image',
            title: 'Package Banner Image',
            onClick: (ev, rowdata) => {
              this.viewGallery(rowdata, 'banner-image');
            },
            icon: "uil uil-image-plus view-icon",
          }
        ],

        toolBarBtnOptions: {
          title: 'Packages',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true)
                confirmDialog.custom({
                  message: "You are about to mass update the status of packages?",
                  accept: () => { this.bulkStatusUpdate(selections, status) }
                });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true)
                confirmDialog.custom({
                  message: "You are about to mass delete packages?",
                  accept: () => { this.bulkDelete(selections) }
                });
              }
            },
          },
          rightBtnsOptions: [
            { onClick: this.setPackagesFormInitValue }
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
        type: "Package",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.packagesTable,
    })
  }
  // bulk status update section end

  // bulk delete section starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "Package",
        name: "id",
        value: selections.map(value => { return value.id }),
        deleted_by: getUserName(),
      },
      dataTable: this.packagesTable,
    })
  }
  // bulk delete section ends

  // CMS Help Form Init Value section starts
  setPackagesFormInitValue = () => {
    this.setState({
      packagesForm: {
        ...this.state.packagesForm,
        initValue: this.packagesFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add package', className: 'cms-popup' })
      })
  }
  // CMS Help Form Init Value section end

  // Edit Help starts
  editPackages = (ev, rowdata) => {
    this.setState({
      packagesForm: {
        ...this.state.packagesForm,
        initValue: {
          id: rowdata.id,
          name: rowdata.name,
          destination_id: rowdata.destination_id,
          description: rowdata.description,
          information: rowdata.information,
          featured: rowdata.featured,
          show_in_banner: rowdata.show_in_banner,
          country_id: rowdata.country_id,
          area: rowdata.area,
          tag_categories: rowdata.tag_categories? this.getTagCategoriesFormData(rowdata.tag_categories) : rowdata.tag_categories,
          tags: rowdata.tags? this.getTagFormData(rowdata.tags) : rowdata.tags,
          price: rowdata.price,
          special_price: rowdata.special_price,
          seo_title: rowdata.seo_title,
          seo_meta_description: rowdata.seo_meta_description,
          seo_meta_keywords: rowdata.seo_meta_keywords,
          is_book_now_enabled: rowdata.is_book_now_enabled,
          status_id: rowdata.status_id
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'update package', className: 'cms-popup' })
      })
  }

  getTagFormData(tags) {
    const tagsId = tags.split(',');
    let selectedTags = [];
    tagsId.map(id => {
      appStore.getState().dropdownDetails.tags.map(tags => {
        if(tags.id == id) {
          selectedTags.push(tags);
        }
      })
    });
    return selectedTags;
  }

  getTagCategoriesFormData(tagsCategories) {
    const tagsCategoryIds = tagsCategories.split(',');
    let selectedTagCategories = [];
    tagsCategoryIds.map(id => {
      appStore.getState().dropdownDetails.tagCategories.map(tagsCategory => {
        if(tagsCategory.id == id) {
          selectedTagCategories.push(tagsCategory);
        }
      })
    });
    return selectedTagCategories;
  }

  // Edit Help end

  // Remove Help starts
  removePackages = async (id) => {
    await response.remove({
      service: this.packagesService,
      method: 'removePackage',
      data: { itemId: id },
      dataTable: this.packagesTable,
    })
  }

  // Removedit Help end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
    dropdown.destinations();
    dropdown.country();
    dropdown.tagCategories();
    dropdown.tags();
  }

  managePackages = (id) => {
    this.props.history.push(`/packages/details/${id}`);
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
    let apiResponse = await  this.packagesService.updatePackageImages(this.state.processingModule.id, image);
    if (apiResponse && apiResponse.data && !apiResponse.isError) {
      galleryPopup.toggle(false);
      toaster.success("Image added successfully!");
      this.packagesTable.current.loadData();
    } else {
      toaster.error("Error in adding image.")
    }
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.packagesTable} options={this.state.options} />
        <CityoneModalPopup>
          <PackagesForm initialValue={this.state.packagesForm} dataTableRef={this.packagesTable} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(PackagesListing));