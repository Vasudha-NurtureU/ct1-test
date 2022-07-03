import React, { Component } from 'react';

// state 
import { connect } from "react-redux";

// utils 

import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { assetCategoryBadge, statusBadge, createdDateBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { dropdown } from 'utils/dropdown';

import { bulk } from "utils/bulk";

import { getUserName, getModuleAccess } from "utils/common";

// components 
import CategoryForm from 'components/assets/category/CategoryForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import CategoryService from 'services/assets/category.service';

class Category extends Component {

  constructor(props) {

    super(props);
    // variable init start 
    this.categoryService = new CategoryService();

    this.categoryTable = React.createRef(null);

    this.categoryFormInitialValue = {
      label: null,
      status_id: null,
      updated_by: "test",
      parent_category_id: 0
    }
    // variable init end

    this.state = {

      categoryForm: {
        isEditable: false,
        initValue: this.categoryFormInitialValue,
        removeId: 0
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Asset Category", url: "assets/category", },
      ],

      // datatables

      options: {

        privilege: {
          isActive: true,
          moduleName: getModuleAccess("ASSET CATEGORIES"),
        },

        tablePrimeConfig: {
          autoLayout: false,
          lazy: true,
          scrollable: true,
          scrollHeight: "500px",
        },

        url: this.categoryService,

        method: 'getCategoryList',

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Category',
            field: 'label',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '200px'
            }
          },
          {
            header: 'Parent Category',
            field: 'parent_category_id',
            sortField: "SortingDisabled",
            filter: true,
            headerStyle: {
              width: '200px'
            },
            body: assetCategoryBadge,
            filterType: 'select',
            filterElementOptions: {
              type: 'Dropdown',
              value: 'assetCategory'
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
              value: 'generalStatus'
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
              width: '145px'
            }
          },
        ],

        actionBtnOptions: [
          {
            type: 'update',
            onClick: this.editCategory
          },
          {
            type: 'delete',
            onClick: (ev, rowData) => {
              confirmDialog.toggle(true);
              confirmDialog.custom({
                message: "Are you sure you want to delete this asset category?",
                accept: () => { this.removeCategory(rowData.asset_category_id); }
              });
            }
          },
        ],

        toolBarBtnOptions: {
          title: 'Asset Category List',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({
                  message: "You are about to mass update the status of asset categories?",
                  accept: () => { this.bulkStatusUpdate(selections, status) }
                });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({
                  message: "Are you sure you want to delete these asset categories? This may affect other screens",
                  accept: () => { this.bulkDelete(selections) }
                });
              }
            },
          },
          rightBtnsOptions: [
            { onClick: this.setCategoryFormInitValue }
          ]
        },
        enableSelection: true,
      },

    }
  }

  // Bulk assets Status Update Starts
  bulkStatusUpdate = async (selections, status_id) => {
    await bulk.setBulkStatus({
      data: {
        type: "AssetCategory",
        name: "asset_category_id",
        value: selections.map(value => { return value.asset_category_id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.categoryTable,
    })
  }
  // Bulk assets Status Update End

  // Bulk assets Delete Starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "AssetCategory",
        name: "asset_category_id",
        value: selections.map(value => { return value.asset_category_id }),
        deleted_by: getUserName()
      },
      dataTable: this.categoryTable,
    })
  }
  // Bulk assets Delete End

  // Add Assets Category starts
  setCategoryFormInitValue = () => {
    this.setState({
      categoryForm: {
        ...this.state.categoryForm,
        initValue: this.categoryFormInitialValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Add Asset Category', className: 'sdm-popup' })
      })
  }
  // Add Assets Category ends

  // Edit Category Starts
  editCategory = (ev, rowData) => {
    this.setState({
      categoryForm: {
        ...this.state.categoryForm,
        initValue: {
          asset_category_id: rowData.asset_category_id,
          label: rowData.label,
          status_id: rowData.status_id,
          parent_category_id: rowData.parent_category_id
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update Asset Category' })
      })
  }
  // Edit Category Ends

  // Remove Category Starts
  removeCategory = async (id) => {
    await response.remove({
      service: this.categoryService,
      method: 'removeCategory',
      data: { itemId: id },
      dataTable: this.categoryTable,
      toasterMessage: {
        success: 'Category removed successfully',
        error: 'Category not removed'
      }
    })
  }
  // Remove Category Ends

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
    dropdown.assetCategory();
  }

  render() {
    return (
      <div>
        <CityoneDataTable options={this.state.options} ref={this.categoryTable} />
        <CityoneModalPopup>
          <CategoryForm initialValue={this.state.categoryForm} dataTableRef={this.categoryTable} />
        </CityoneModalPopup>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default connect(mapStateToProps)(Category);