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
import CountryForm from 'components/standardData/country/CountryForm';

// shared components 
import CityoneDataTable from 'shared-components/datatable/CityoneDataTable';

import CityoneModalPopup from 'shared-components/modalPopup';

// services 
import CountryService from 'services/standard-data/country.service';

class Country extends Component {

  constructor(props) {

    super(props);

    // variable init starts
    this.countryService = new CountryService();

    this.countryTable = React.createRef(null);

    this.countryFormInitValue = {
      country_name: null,
      status_id: null,
      sort_order: 1
    }
    // variable init end
    this.state = {

      countryForm: {
        isEditable: false,
        initValue: this.countryFormInitValue,
      },

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Country", url: "country", },
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

        url: this.countryService,

        method: 'getCountryList',

        lazyParams: {
          sortField: "created_at",
          sortOrder: -1
        },

        columns: [
          {
            header: 'Name',
            field: 'country_name',
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
            onClick: this.editCountry
          },
          {
            onClick: (ev, rowdata) => {
              confirmDialog.toggle(true);

              confirmDialog.custom({
                message: "Are you sure you want to delete this country? This may affect other screens",

                header: "Confirmation",

                icon: "pi pi-exclamation-triangle",

              });
              confirmDialog.accept(() => { this.removeCountry(rowdata.country_id) });

            }
          }
        ],

        toolBarBtnOptions: {
          title: 'Country List',
          selection: {
            field: {
              options: "generalStatus"
            },
            updateBtnsOptions: {
              onClick: ({ selections, status }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "You are about to mass update the status of countries?" });
                confirmDialog.accept(() => { this.bulkStatusUpdate(selections, status) });
              }
            },
            deleteBtnsOptions: {
              onClick: ({ selections }) => {
                confirmDialog.toggle(true);
                confirmDialog.custom({ message: "Are you sure you want to delete these countries? This may affect other screens" });
                confirmDialog.accept(() => { this.bulkDelete(selections) });
              }
            },
          },
          rightBtnsOptions: [
            { onClick: this.setCountryFormInitValue }
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
        type: "Country",
        name: "country_id",
        value: selections.map(value => { return value.country_id }),
        status_id: status_id,
        updated_by: getUserName()
      },
      dataTable: this.countryTable,
    })
  }
  //bulk status update end

  //bulk delete starts
  bulkDelete = async (selections) => {
    await bulk.deleteBulkItems({
      data: {
        type: "Country",
        name: "country_id",
        value: selections.map(value => { return value.country_id }),
        deleted_by: getUserName(),
      },
      dataTable: this.countryTable,
    })
  }
  //bulk delete end

  // Add Country starts
  setCountryFormInitValue = () => {
    this.setState({
      countryForm: {
        ...this.state.countryForm,
        initValue: this.countryFormInitValue,
        isEditable: false
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'ADD Country', className: 'sdm-popup' })
      })
  }
  // Add Country end

  // Edit Country starts
  editCountry = (ev, rowdata) => {
    this.setState({
      countryForm: {
        ...this.state.countryForm,
        initValue: {
          country_id: rowdata.country_id,
          country_name: rowdata.country_name,
          status_id: rowdata.status_id,
        },
        isEditable: true
      }
    },
      () => {
        modalPopup.toggle(true)
        modalPopup.custom({ header: 'UPDATE Country', className: 'sdm-popup' })
      })
  }
  // Edit Country end

  // Remove Country starts
  removeCountry = async (id) => {
    await response.remove({
      service: this.countryService,
      method: 'removeCountry',
      data: { itemId: id },
      dataTable: this.countryTable,
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
        <CityoneDataTable ref={this.countryTable} options={this.state.options} />
        <CityoneModalPopup>
          <CountryForm initialValue={this.state.countryForm} dataTableRef={this.countryTable} />
        </CityoneModalPopup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(Country));