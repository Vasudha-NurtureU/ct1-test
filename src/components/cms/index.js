import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { bulk } from "utils/bulk";

import { statusBadge, createdDateBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { getModuleAccess, getUserName } from "utils/common";

// components
import HelpForm from 'components/cms/HelpForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import HelpService from 'services/cms/help.service';

class Help extends Component {

  constructor(props) {

    super(props);

    // variable inti starts
    this.helpService = new HelpService();

    this.helpTable = React.createRef(null);

    this.helpFormInitValue = {
      page_title: null,
      page_category: "HELP",
      page_content: null,
      seo_title: null,
      seo_meta_description: null,
      seo_meta_keywords: null,
      status_id: null
    };

    // variable inti end

    this.state = {

      helpForm: {
        isEditable: false,
        initValue: this.helpFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "CMS", url: "cms", },
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

        url: this.helpService,

        method: 'getHelpList',

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Page',
            field: 'page_title',
            sortable: true,
            filter: true
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
            filterElementOptions: {
              type: 'Calendar',
              primeFieldProps: {
                maxDate: new Date()
              },
            },
            headerStyle: {
              width: '120px'
            },
            body: createdDateBadge
          },
        ],

        actionBtnOptions: [
          {
            type: 'update',
            onClick: this.editHelp
          },
          {
            type: 'delete',
            onClick: (ev, rowData) => {
              confirmDialog.toggle(true)
              confirmDialog.custom({
                message: "Are you sure you want to delete this CMS page?",
                accept: () => { this.removeHelp(rowData.page_id) }
              });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'CMS pages',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true)
                confirmDialog.custom({
                  message: "You are about to mass update the status of CMS pages?",
                  accept: () => { this.bulkStatusUpdate(selections, status) }
                });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true)
                confirmDialog.custom({
                  message: "You are about to mass delete CMS pages?",
                  accept: () => { this.bulkDelete(selections) }
                });
              }
            },
          },
          rightBtnsOptions: [
            { onClick: this.setHelpFormInitValue }
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
        type: "CmsPage",
        name: "page_id",
        value: selections.map(value => { return value.page_id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.helpTable,
    })
  }
  // bulk status update section end

  // bulk delete section starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "CmsPage",
        name: "page_id",
        value: selections.map(value => { return value.page_id }),
        deleted_by: getUserName(),
      },
      dataTable: this.helpTable,
    })
  }
  // bulk delete section ends

  // CMS Help Form Init Value section starts
  setHelpFormInitValue = () => {
    this.setState({
      helpForm: {
        ...this.state.helpForm,
        initValue: this.helpFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add cms page', className: 'cms-popup' })
      })
  }
  // CMS Help Form Init Value section end

  // Edit Help starts
  editHelp = (ev, rowdata) => {
    this.setState({
      helpForm: {
        ...this.state.helpForm,
        initValue: {
          page_id: rowdata.page_id,
          page_title: rowdata.page_title,
          page_category: rowdata.page_category,
          page_content: rowdata.page_content,
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
        modalPopup.custom({ header: 'update cms page', className: 'cms-popup' })
      })
  }

  // Edit Help end

  // Remove Help starts
  removeHelp = async (id) => {
    await response.remove({
      service: this.helpService,
      method: 'removeHelp',
      data: { itemId: id },
      dataTable: this.helpTable,
    })
  }

  // Removedit Help end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.helpTable} options={this.state.options} />
        <CityoneModalPopup>
          <HelpForm initialValue={this.state.helpForm} dataTableRef={this.helpTable} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(Help));