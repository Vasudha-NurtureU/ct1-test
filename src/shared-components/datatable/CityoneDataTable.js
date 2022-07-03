/* eslint-disable array-callback-return */
import React from 'react';

import { connect } from "react-redux";

// utils 
import moment from 'moment';

import { getUserType } from 'utils/common';

// primereact components 
import { Button } from "primereact/button";

import { Dropdown } from 'primereact/dropdown';

import { Calendar } from 'primereact/calendar';

import { DataTable } from 'primereact/datatable';

import { Column } from 'primereact/column';

import { merge, isEmpty, isString, upperFirst } from 'lodash';

import { optionsDefaultValue } from 'shared-components/datatable/options';

import CityoneDatatableToolbar from 'shared-components/datatable/CityoneDatatableToolbar';

import CityoneDataTablePagination from 'shared-components/datatable/CityoneDataTablePagination';

class CityoneDataTable extends React.PureComponent {

  constructor(props) {

    super(props);

    const {
      privilege,
      tablePrimeConfig,
      url,
      method,
      urlPath,
      params,
      lazyParams,
      columns,
      pagination,
      enableActionColumn,
      actionBtnOptions,
      toolBarBtnOptions,
      enableSelection
    } = merge({}, optionsDefaultValue, this.props.options)

    this.toolBarRef = React.createRef(null);

    this.state = {

      privilege: privilege,

      tablePrimeConfig: tablePrimeConfig,

      url: url,

      method: method,

      urlPath: urlPath,

      params: params,

      columns: columns,

      pagination: pagination,

      enableActionColumn: enableActionColumn,

      actionBtnOptions: actionBtnOptions,

      loading: false,

      lazyParams: lazyParams,

      first: lazyParams.first,

      rows: lazyParams.rows,

      currentPage: lazyParams.page,

      pageInputTooltip: 'Press \'Enter\' key to go to this page.',

      totalRecords: 0,

      data: null,

      globalFilter: null,

      toolBarBtnOptions: toolBarBtnOptions,

      selections: null,

      enableSelection: enableSelection

    };

  }

  loadData = async () => {

    this.setState({ loading: true });

    try {
      if (this.state.url && this.state.method) {

        let tableResponse = await this.state.url[this.state.method]({ lazyEvent: this.state.lazyParams, ...this.state.params }, this.state.urlPath)

        if (tableResponse && tableResponse.data && !tableResponse.data.isError && Array.isArray(tableResponse.data.data)) {
          this.setState({
            totalRecords: parseInt(tableResponse.data.count),
            data: tableResponse.data.data,
            loading: false
          })
        }
        else {
          this.setState({
            totalRecords: 0,
            data: [],
            loading: false
          })
        }
      }
    }
    catch {
      this.setState({ loading: false });
    }
  }

  onPageChange = (event) => {
    if (this.state.tablePrimeConfig.lazy) {
      this.setState(
        {
          lazyParams: {
            ...this.state.lazyParams,
            first: event.first,
            rows: event.rows,
            page: event.page + 1
          }
        },
        () => { this.loadData() }
      );
    } else {
      this.setState({
        first: event.first,
        rows: event.rows,
        currentPage: event.page + 1
      });
    }
  }

  onPageInputKeyDown = (event, options) => {
    if (event.key === 'Enter') {
      const page = parseInt(this.state.currentPage);
      if (page < 0 || page > options.totalPages) {
        this.setState({ pageInputTooltip: `Value must be between 1 and ${options.totalPages}.` })
      }
      else {
        const first = this.state.currentPage ? options.rows * (page - 1) : 0;
        this.setState({ first: first, pageInputTooltip: 'Press \'Enter\' key to go to this page.' });
      }
    }
  }

  onPageInputChange = (event) => {
    this.setState({ currentPage: event.target.value });
  }

  // template section 

  actionColumnTemplate = (rowData) => {

    let actionBtnCheck;
    // let access, actionBtnCheck;

    // if (this.state.privilege.moduleName && isArray(this.state.privilege.moduleName.access)) {
    //   access = this.state.privilege.moduleName.access;
    // } else {
    //   access = [];
    // }

    return (
      <div className='p-text-center'>
        {this.state.actionBtnOptions.map((option, index) => {
          let buttonOption = { ...option };

          if (this.state.privilege.isActive && getUserType() === 'U') {
            actionBtnCheck = option.visibility !== false;
            //&& access.includes(option.type);
            buttonOption.disabled=actionBtnCheck === false ? true :false
          } else {
            actionBtnCheck = option.visibility !== false
            buttonOption.disabled=actionBtnCheck === false ? true :false
          }

          if ((actionBtnCheck === true) && (typeof option.visibilityCheck === 'function')) {
            actionBtnCheck = option.visibilityCheck(rowData);
            buttonOption.disabled=actionBtnCheck === false ? true :false
          }

          if(option.hide === true) {
            return '';
          }

            return <Button key={index} {...buttonOption} onClick={ev => {
              option.onClick(ev, rowData);
            }}></Button>

        })}
      </div>
    );
  };


  // lazy section start 
  onSort = (event) => {
    if (event.sortField && (event.sortField !== "SortingDisabled")) {
      setTimeout(() => {
        let lazyParams = { ...this.state.lazyParams, ...event };
        this.setState({ lazyParams }, this.loadData);
      }, 1000);
    }
  }

  onFilter = (event) => {
    setTimeout(() => {
      let lazyParams = { ...this.state.lazyParams, ...event };
      lazyParams['first'] = 0;
      lazyParams['page'] = 1;
      this.setState({ lazyParams }, this.loadData);
    }, 1000);
  }
  // lazy section end

  onSelectionChange = (ev) => {
    if (ev.originalEvent.target.className.includes("p-checkbox-box") || ev.originalEvent.target.className.includes("p-checkbox-icon"))
      this.setState({ selections: ev.value })
  }

  removeSelection = () => {
    this.setState({ selections: null })
    if (this.toolBarRef && this.toolBarRef.current) {
      this.toolBarRef.current.resetStatus();
    }
  }

  // filter states 
  handleFilterElement = (ev, colName, type, item) => {
    let val, filterVal;

    if (type === 'calendar' && ev.target.value) {
      if (!isEmpty(item.filterElementOptions.outputFormat) && item.filterElementOptions.outputFormat) {
        val = moment(ev.target.value).format(item.filterElementOptions.outputFormat)
      } else {
        val = moment(ev.target.value).format('YYYY-MM-DD HH:mm:ss')
      }
    }
    else {
      val = ev.target.value;
    }

    if (item.filterField) {
      filterVal = item.filterField;
    } else {
      filterVal = colName;
    }

    this.dt.filter(val, filterVal, 'startsWith');

    this.setState({ [colName]: ev.target.value });
  }

  lookup = (obj, key) => {
    return key.split('.').reduce((o, k) => o && o[k], obj);
  }

  transformBodyTemplate = (rowData, { field }) => {
    let data = this.lookup(rowData, field);
    if (data || (data === 0)) {
      return (isString(data)) ? <div className="cityone-datatable-td" title={upperFirst(data)}>{upperFirst(data)}</div> : <div className="cityone-datatable-td" title={data}>{data}</div>;
    }
    else {
      return "-";
    }
  }

  defaultBodyTemplate = (rowData, { field }) => {
    let data = this.lookup(rowData, field);
    return (!isEmpty(data) || (data === 0)) ? <div className="cityone-datatable-td" title={data}>{data}</div> : "-";
  }

  componentDidMount() {
    this.loadData()
  }

  render() {

    let DatatableLazyConfig, dataTableConfigs, actionTypes, showActionColumn;

    const { access } = this.state.privilege.moduleName;

    if (this.state.tablePrimeConfig.lazy) {
      DatatableLazyConfig = {
        first: this.state.lazyParams.first,
        rows: this.state.lazyParams.rows,
        totalRecords: this.state.totalRecords,
        loading: this.state.loading,
        filters: this.state.lazyParams.filters,
        sortField: this.state.lazyParams.sortField,
        sortOrder: this.state.lazyParams.sortOrder,
        onFilter: this.onFilter,
        onSort: this.onSort,
      }
    } else {
      DatatableLazyConfig = {
        first: this.state.first,
        rows: this.state.rows,
        globalFilter: this.state.globalFilter
      }
    }

    dataTableConfigs = {
      ...DatatableLazyConfig,
      ...this.state.tablePrimeConfig
    }

    actionTypes = this.state.actionBtnOptions.map((item) => { return item.type })

    if (this.state.privilege.isActive && getUserType() === 'U') {
      showActionColumn = actionTypes.some((ac) => { return access.includes(ac) })
    } else {
      showActionColumn = true
    }

    return (
      <div className={`cityone-datatable ${this.state.tablePrimeConfig.lazy ? 'cityone-datatable-lazy' : ''}`}>

        <CityoneDatatableToolbar
          ref={this.toolBarRef}
          tableRef={this.dt}
          tableColumns={this.state.columns}
          enableSelection={this.state.enableSelection}
          selections={this.state.selections}
          tableItems={this.state.data}
          toolBarOptions={this.state.toolBarBtnOptions}
          access={this.state.privilege}
          showBulkEdit={showActionColumn}
        >
        </CityoneDatatableToolbar>

        <DataTable
          ref={(el) => this.dt = el}
          value={this.state.data}
          paginator
          paginatorTemplate={CityoneDataTablePagination(this.state.pagination)}
          onPage={this.onPageChange}
          selection={this.state.selections}
          onSelectionChange={this.onSelectionChange}
          {...dataTableConfigs}
        >

          {this.state.enableSelection && <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>}

          {this.state.columns.map((item, index) => {

            if ((typeof item.body !== 'function') && !item.showOriginalValue) {
              item.body = (item.transformValue !== false) ? this.transformBodyTemplate : this.defaultBodyTemplate;
            }

            if (item.filterElementOptions) {

              let defaultOption, filterOptions;

              defaultOption = [{ label: "All", value: "" }];

              (!isEmpty(this.props.dd[item.filterElementOptions.value])) ?
                filterOptions = this.props.dd[item.filterElementOptions.value] :
                filterOptions = [];

              switch (item.filterElementOptions.type) {
                case 'Dropdown':
                  return <Column {...item} key={index}
                    filterElement={
                      <Dropdown
                        {...item.filterElementOptions.primeFieldProps}
                        className="p-column-filter"
                        options={[...defaultOption, ...filterOptions]}
                        optionLabel="label"
                        value={this.state[item.field]}
                        filter={false}
                        onChange={(ev) => { this.handleFilterElement(ev, item.field, 'dropdown', item) }}
                      >
                      </Dropdown>
                    }
                  />
                case 'Calendar':
                  return <Column {...item} key={index}
                    filterElement={
                      <Calendar
                        className="p-column-filter"
                        value={this.state[item.field]}
                        readOnlyInput
                        dateFormat={"M dd, yy"}
                        showButtonBar
                        todayButtonClassName="p-button-secondary p-ml-2"
                        clearButtonClassName="p-button-secondary p-mr-2"
                        {...item.filterElementOptions.primeFieldProps}
                        placeholder="Filter by from date"
                        onChange={(ev) => { this.handleFilterElement(ev, item.field, 'calendar', item) }}
                      />
                    }
                  />
                default:
              }

            } else {
              return <Column {...item} key={index} />
            }

          })}

          {
            (this.state.enableActionColumn === true && showActionColumn) &&
            <Column className='p-text-center p-action-column' body={this.actionColumnTemplate} header='Actions' style={{ width: '160px' }} />
          }

        </DataTable>

      </div>
    );

  }
}

const mapStateToProps = (state) => ({
  dd: state.dropdownDetails,
});

export default connect(mapStateToProps, null, null, { forwardRef: true })(CityoneDataTable);