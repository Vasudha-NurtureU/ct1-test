import React, { Component } from 'react';

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { assetListingCategoryBadge, statusBadge, createdDateBadge, filetypeBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { dropdown } from 'utils/dropdown';

import { bulk } from "utils/bulk";

import { getUserName, getModuleAccess, downloadFile } from "utils/common";

// components 
import AssetsForm from 'components/assets/listing/AssetsForm';

// prime components 

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import AssetsService from 'services/assets/assets.service';

// config
import config from 'assets/config';

// constants
const mediaFolder = "digital-asset";

class AssetsManagementList extends Component {

  constructor(props) {

    super(props);
    // variable init starts
    this.assetsService = new AssetsService();

    this.assetsTable = React.createRef(null);

    this.assetsFormInitialValue = {
      label: null,
      slug: "test",
      description: null,
      file_name: null,
      file_type: null,
      asset_category_id: null,
      download_count: 0,
      status_id: null,
      updated_by: "test"
    }
    //variable inti end

    this.state = {

      assetsForm: {
        isEditable: false,
        initValue: this.assetsFormInitialValue,
        removeId: 0
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Asset", url: "assets/listing", },
      ],
      // datatables
      options: {

        privilege: {
          isActive: true,
          moduleName: getModuleAccess("DAM"),
        },

        tablePrimeConfig: {
          autoLayout: true,
          lazy: true,
          scrollable: true,
          scrollHeight: "500px",
        },

        url: this.assetsService,

        method: 'getAssetsList',

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Label',
            field: 'label',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '200px'
            }
          },
          {
            header: 'File Name',
            field: 'file_name',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '200px'
            }
          },
          {
            header: 'Category',
            field: 'asset_category_id',
            sortField: "SortingDisabled",
            filter: true,
            filterType: 'select',
            filterElementOptions: {
              type: 'Dropdown',
              value: 'assetCategory'
            },
            headerStyle: {
              width: '200px'
            },
            body: assetListingCategoryBadge,
          },
          {
            header: 'File Type',
            field: 'file_type',
            sortable: true,
            filter: false,
            body: filetypeBadge,
            headerStyle: {
              width: '120px'
            }
          },
          {
            header: 'Status',
            field: 'status_id',
            sortable: true,
            filter: true,
            body: statusBadge,
            filterType: 'select',
            headerStyle: {
              width: '120px'
            },
            filterElementOptions: {
              type: 'Dropdown',
              value: 'generalStatus'
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
            onClick: this.editAssets
          },
          {
            type: 'delete',
            onClick: (ev, rowData) => {
              confirmDialog.toggle(true);
              confirmDialog.custom({
                message: "Are you sure you want to delete this asset?",
                accept: () => { this.removeAssets(rowData.asset_id); }
              });
            }
          },
          {
            type: 'update',
            icon: "pi pi-download view-icon",
            className: "p-mr-2 p-button-icon-only",
            title: "Download Attachment",
            onClick: (ev, rowData) => { this.downloadAsset(rowData); }
          },
        ],

        toolBarBtnOptions: {
          title: 'Asset List',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({
                  message: "You are about to mass update the status of assets?",
                  accept: () => { this.bulkStatusUpdate(selections, status) }
                });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({
                  message: "Are you sure you want to delete these assets? ",
                  accept: () => { this.bulkDelete(selections) }
                });
              }
            },
          },
          rightBtnsOptions: [
            { onClick: this.setAssetsFormInitValue }
          ]
        },
        enableSelection: true,
      }
    }
  }

  // Bulk Status Update Section starts

  bulkStatusUpdate = async (selections, status_id) => {
    await bulk.setBulkStatus({
      data: {
        type: "Asset",
        name: "asset_id",
        value: selections.map(value => { return value.asset_id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.assetsTable,
    })
  }
  // Bulk Status Update Section end

  // Bulk Delete Section starts

  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "Asset",
        name: "asset_id",
        value: selections.map(value => { return value.asset_id }),
        deleted_by: getUserName()
      },
      dataTable: this.assetsTable,
    })
  }
  // Bulk Delete Section end

  // setting Assets Form Init Values
  setAssetsFormInitValue = () => {
    this.setState({
      assetsForm: {
        ...this.state.assetsForm,
        initValue: this.assetsFormInitialValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Add Asset', className: 'sdm-popup' })
      })
  }

  // setting Assets Form Init end

  // Edit Assets Form Values

  editAssets = (ev, rowData) => {
    this.setState({
      assetsForm: {
        ...this.state.assetsForm,
        initValue: {
          asset_id: rowData.asset_id,
          label: rowData.label,
          slug: rowData.slug,
          description: rowData.description,
          file_name: rowData.file_name,
          file_type: rowData.file_type,
          asset_category_id: rowData.asset_category_id,
          download_count: rowData.download_count,
          status_id: rowData.status_id,
          created_by: rowData.created_by,
          updated_by: rowData.updated_by
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update Asset', className: 'sdm-popup' })
      })
  }

  // Edit Assets Form end

  // Remove Assets Section starts
  removeAssets = async (id) => {
    await response.remove({
      service: this.assetsService,
      method: 'removeAsset',
      data: { itemId: id },
      dataTable: this.assetsTable,
    })
  }
  // Remove Assets Section end
  downloadAsset = (rowData) => {
    try {
      const downloadLink = config.mediaURL + mediaFolder + "/" + rowData.file_name;
      if (rowData.file_name) {
        downloadFile(downloadLink, rowData.file_name);
      }
    }
    catch {
      console.log("Something went wrong.");
    }
  }
  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus()
    dropdown.assetCategory()
  }

  render() {
    return (
      <div>
        <CityoneDataTable options={this.state.options} ref={this.assetsTable} />
        <CityoneModalPopup>
          <AssetsForm initialValue={this.state.assetsForm} dataTableRef={this.assetsTable} />
        </CityoneModalPopup>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default connect(mapStateToProps)(AssetsManagementList);