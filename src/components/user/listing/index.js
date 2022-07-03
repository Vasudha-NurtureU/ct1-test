import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { dropdown } from "utils/dropdown";

import { createdDateBadge, statusBadge } from "utils/badgeTemplate";

import { confirmDialog } from "utils/confirmDialog";

import { modalPopup } from "utils/modalPopup";

import { bulk } from "utils/bulk";

import { getUserName, getModuleAccess, getUser } from "utils/common";

// components
import UserForm from 'components/user/listing/UserForm';

import UserRoleUpdateForm from 'components/user/listing//UserRoleUpdate';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import UserService from 'services/user/user.service';

class UserListing extends Component {

  constructor(props) {

    super(props);

    this.userService = new UserService();

    this.userTable = React.createRef(null);

    this.userFormInitValue = {
      name: null,
      email_address: null,
      contact_number: null,
      role_id: null,
    }

    this.state = {

      userForm: {
        isEditable: false,
        initValue: this.formInitValue,
      },
      updateRole:false,

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "User", url: "user", },
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

        url: this.userService,

        method: 'getUserList',

        params : {
          role: getUser() ? getUser().role_slug : undefined
        },

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
            header: 'Email',
            field: 'email_address',
            sortable: true,
            filter: true,
            headerStyle: {
              width: '200px'
            },
            transformValue: false
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
            title: 'Edit User',
            onClick: this.editUser
          },
          {
            type: 'delete',
            icon: "uil uil-trash-alt remove-icon",
            title: 'Delete User',
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);
              confirmDialog.accept(() => { this.removeUser(rowdata.user_id) });
            }
          }
        ],

        toolBarBtnOptions: {
          title: 'user list',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of users?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these users? This may affect other screens" });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            {
              onClick: this.setUserFormInitValue
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
        type: "User",
        name: "user_id",
        value: selections.map(value => { return value.user_id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.userTable,
    })
  }
  //bulk update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "User",
        name: "user_id",
        value: selections.map(value => { return value.user_id }),
        deleted_by: getUserName()
      },
      dataTable: this.userTable,
    })
  }
  //bulk delete end

  // Add User Starts
  setUserFormInitValue = () => {
    this.setState({
      userForm: {
        ...this.state.userForm,
        initValue: this.userFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'add user', className: 'sdm-popup' })
      })
  }
  // Add User end

  //Edit User starts
  editUser = (ev, rowdata) => {
    this.setState({
      userForm: {
        ...this.state.userForm,
        initValue: {
          user_id: rowdata.user_id,
          name: rowdata.name,
          email_address: rowdata.email_address,
          contact_number: rowdata.contact_number,
          status_id: rowdata.status_id,
          role_id: rowdata.role_id,
        },
        isEditable: true
      },
      updateRole:false
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'update user', className: 'sdm-popup' })
      })
  }

  //update roles
  editUserRoles = (ev, rowdata) => {
    this.setState({
      userForm: {
        ...this.state.userForm,
        initValue: {
          user_id: rowdata.user_id,
          name: rowdata.name,
          email_address: rowdata.email_address,
          contact_number: rowdata.contact_number,
          status_id: rowdata.status_id,
          role_id: rowdata.role_id,
        },
        isEditable: true
      },
      updateRole:true
    },
      () => {
        modalPopup.toggle(true)
      })
  }
  //Edit User end

  //remove User starts
  removeUser = async (id) => {
    await response.remove({
      service: this.userService,
      method: 'removeUser',
      data: { itemId: id },
      dataTable: this.userTable,
    })
  }
  //remove User end

  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    dropdown.generalStatus();
    dropdown.roles();
  }

  render() {
    return (
      <div>
        <CityoneDataTable ref={this.userTable} options={this.state.options} />
        
        {this.state.updateRole === true ?
        <CityoneModalPopup>
          <UserRoleUpdateForm initialValue={this.state.userForm} dataTableRef={this.userTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>:<CityoneModalPopup>
          <UserForm initialValue={this.state.userForm} dataTableRef={this.userTable} fieldOptions={this.state.fieldOptions} />
        </CityoneModalPopup>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(UserListing));