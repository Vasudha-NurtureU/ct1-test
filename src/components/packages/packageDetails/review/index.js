import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { createdDateBadge, statusBadge, customerBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { bulk } from "utils/bulk";

import { getModuleAccess, getUserName } from "utils/common";


// components
import ReviewForm from 'components/packages/packageDetails/review/ReviewForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import PackageService from 'services/packages/packages.service';

class Review extends Component {

  constructor(props) {

    super(props);

    this.packageService = new PackageService();

    this.reviewTable = React.createRef(null);

    this.reviewFormInitValue = {
      review: null,
      ratings: null,
      user_id: null,
      status_id: null,
      package_id: this.props.packageId,
      created_by: getUserName()
    }

    this.state = {
      reviewForm: {
        isEditable: false,
        initValue: this.reviewFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Packages", url: "packages/listing" },
        { label: "Manage Reviews", url: "" },
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

        method: 'getPackageReviewList',

        params: {
          id: this.props.packageId
        },

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Review',
            field: 'review',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'Ratings',
            field: 'ratings',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '150px'
            }
          },
          {
            header: 'User',
            field: 'user_id',
            sortable: true,
            filter: true,
            body: customerBadge,
            filterType: 'select',
            filterElementOptions: {
              type: 'Dropdown',
              value: "customers",
            },
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
            onClick: this.editReview,
          },
          {
            type: 'delete',
            icon: "uil uil-trash-alt remove-icon",
            title: 'Delete Review',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeReview(rowdata.id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Reviews',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of reviews?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these reviews? " });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              onClick: this.setReviewFormInitValue
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
        type: "PackageReview",
        name: "id",
        value: selections.map(value => { return value.id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.reviewTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "PackageReview",
        name: "id",
        value: selections.map(value => { return value.id }),
        deleted_by: getUserName(),
      },
      dataTable: this.reviewTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setReviewFormInitValue = () => {
    this.setState({
      reviewForm: {
        ...this.state.reviewForm,
        initValue: this.reviewFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add review', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editReview = (ev, rowdata) => {
    this.setState({
      reviewForm: {
        ...this.state.reviewForm,
        initValue: {
          id: rowdata.id,
          review: rowdata.review,
          ratings: rowdata.ratings,
          user_id: rowdata.user_id,
          status_id: rowdata.status_id,
          package_id: rowdata.package_id,
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'Update Review', className: 'sdm-popup' })
      })
  }

  //remove User starts
  removeReview = async (id) => {
    await response.remove({
      service: this.packageService,
      method: 'deleteReview',
      data: { itemId: id },
      dataTable: this.reviewTable,
    })
  }
  //remove User end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
    dropdown.customers();
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.reviewTable} options={this.state.options} />
        <CityoneModalPopup>
          <ReviewForm initialValue={this.state.reviewForm} dataTableRef={this.reviewTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(Review));