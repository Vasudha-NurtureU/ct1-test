import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { createdDateBadge, statusBadge, tagCategoryBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { bulk } from "utils/bulk";

import { getModuleAccess } from "utils/common";

// components
import TagsForm from 'components/tags/listing/TagsForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import TagsService from 'services/tags/tags.service';

class TagsListing extends Component {

  constructor(props) {

    super(props);

    this.tagsService = new TagsService();

    this.tagsTable = React.createRef(null);

    this.tagsFormInitValue = {
      name: null,
      tag_category_id: null,
      status_id: null,
    }

    this.state = {

      tagsForm: {
        isEditable: false,
        initValue: this.formInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Tags", url: "tags", },
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

        url: this.tagsService,

        method: 'getTagsList',

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Name',
            field: 'name',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Tag Category',
            field: 'tag_category_id',
            sortable: true,
            filter: true,
            filterType: 'select',
            filterElementOptions: {
              type: 'Dropdown',
              value: "tagCategories",
            },
            body: tagCategoryBadge,
            headerStyle: {
              width: '120px'
            }
          },
          {
            header: 'Status',
            field: 'status_id',
            sortable: true,
            filter: true,
            filterType: 'select',
            filterElementOptions: {
              type: 'Dropdown',
              value: "generalStatus",
            },
            body: statusBadge,
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
            title: 'Edit Tag',
            onClick: this.editTag,
            icon: "uil uil-pen edit-icon",
          },
          {
            type: 'delete',
            icon: "uil uil-trash-alt remove-icon",
            title: 'Delete Tag',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeTag(rowdata.id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Tags',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of tags?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these tags? " });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              onClick: this.setTagFormInitValue
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
        type: "Tags",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
      },
      dataTable: this.tagsTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "Tag",
        name: "id",
        value: selections.map(value => { return value.id }),
      },
      dataTable: this.tagsTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setTagFormInitValue = () => {
    this.setState({
      tagsForm: {
        ...this.state.tagsForm,
        initValue: this.tagsFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add tag', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editTag = (ev, rowdata) => {
    this.setState({
      tagsForm: {
        ...this.state.tagsForm,
        initValue: {
          id: rowdata.id,
          name: rowdata.name,
          tag_category_id: rowdata.tag_category_id,
          status_id: rowdata.status_id,
        },
        isEditable: true
      },
      updateRole:false
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update tag', className: 'sdm-popup' })
      })
  }

  //remove User starts
  removeTag = async (id) => {
    await response.remove({
      service: this.tagsService,
      method: 'removeTag',
      data: { itemId: id },
      dataTable: this.tagsTable,
    })
  }
  //remove User end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
    dropdown.tagCategories();
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.tagsTable} options={this.state.options} />
        
        <CityoneModalPopup>
        </CityoneModalPopup><CityoneModalPopup>
          <TagsForm initialValue={this.state.tagsForm} dataTableRef={this.tagsTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(TagsListing));