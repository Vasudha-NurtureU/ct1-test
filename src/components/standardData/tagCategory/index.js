import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { statusBadge, createdDateBadge } from "utils/badgeTemplate";

import { dropdown } from "utils/dropdown";

import { bulk } from "utils/bulk";

import { getModuleAccess, getUserName } from "utils/common";

// components
import TagcategoryForm from 'components/standardData/tagCategory/TagcategoryForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import TagCategoryService from 'services/standard-data/tagcategory.service';

class Tagcategory extends Component {

  constructor(props) {

    super(props);


    // variable init starts
    this.tagCategoryService = new TagCategoryService();

    this.tagcategoryTable = React.createRef(null);

    this.tagCategoryFormInitValue = {
      name: null,
      status_id: null,
      sort_order: 1
    }
    // variable init end
    this.state = {
      tagcategoryForm: {
        isEditable: false,
        initValue: this.tagCategoryFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Tag Categories", url: "tagcategories", },
      ],

      // datatables 


      options: {
        privilege: {
          isActive: true,
          moduleName: getModuleAccess("STANDARD DATA"),
        },

        tablePrimeConfig: {
          autoLayout: true,
          lazy: true,
        },

        url: this.tagCategoryService,

        method: 'getTagcategoryList',

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Name',
            field: 'name',
            sortable: true,
            editable: true,
            filter: true,
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
          },
          {
            header: 'Created On',
            field: 'created_at',
            sortable: true,
            filter: true,
            body: createdDateBadge,
            filterElementOptions: {
              type: 'Calendar',
              primeFieldProps: {
                maxDate: new Date()
              },
            },
          },
        ],

        actionBtnOptions: [
          {
            onClick: this.editTagCategory
          },
          {
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);

              confirmDialog.custom({
                message: "Are you sure you want to delete this tag category? ",

                header: "Confirmation",

                icon: "pi pi-exclamation-triangle",

              });
              confirmDialog.accept(() => { this.removeTagCategory(rowdata.id) });

            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Tag category List',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of tag categories?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these tag categories? " });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            { onClick: this.setTagCategoryFormInitValue }
          ]
        },
        enableSelection: true,
      },

      // datatables 

    }
  }

  //bulk status update starts
  bulkStatusUpdate = async (selections, status_id) => {
    await bulk.setBulkStatus({
      data: {
        type: "TagCategory",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.tagcategoryTable,
    })
  }
  //bulk status update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "TagCategory",
        name: "id",
        value: selections.map(value => { return value.id }),
        deleted_by: getUserName(),
      },
      dataTable: this.tagcategoryTable,
    })
  }
  //bulk delete end

  // Add Country starts
  setTagCategoryFormInitValue = () => {
    this.setState({
      tagcategoryForm: {
        ...this.state.tagcategoryForm,
        initValue: this.setTagCategoryFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'ADD Tag category', className: 'sdm-popup' })
      })
  }
  // Add Country end

  // Edit Country starts
  editTagCategory = (ev, rowdata) => {
    this.setState({
      tagcategoryForm: {
        ...this.state.tagcategoryForm,
        initValue: {
          id: rowdata.id,
          name: rowdata.name,
          status_id: rowdata.status_id,
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'UPDATE Tag Category', className: 'sdm-popup' })
      })
  }
  // Edit Country end

  // Remove Country starts
  removeTagCategory = async (id) => {
    await response.remove({
      service: this.tagCategoryService,
      method: 'removeTagcategory',
      data: { itemId: id },
      dataTable: this.tagcategoryTable,
    })
  }
  // Remove Country end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();

  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.tagcategoryTable} options={this.state.options} />
        <CityoneModalPopup>
          <TagcategoryForm initialValue={this.state.tagcategoryForm} dataTableRef={this.tagcategoryTable} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(Tagcategory));