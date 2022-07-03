import React, { Component } from 'react'

// utils
import moment from 'moment';

import { classNames } from 'primereact/utils';

// components
import { CSVLink } from "react-csv";

// prime components 
import { Paginator } from 'primereact/paginator';

import fileDownload from 'assets/icons/download_file.png'

class ReportDownload extends Component {

  constructor(props) {

    super(props);

    this.csvButton = React.createRef(null);

    const { service, method, columns, fileName, params, rows, timestampSuffix, csvExtension, first } = this.props.options;

    this.state = {
      reportData: [],
      service: service,
      method: method,
      columns: columns,
      fileName: fileName,
      params: params,
      rows: rows,
      timestampSuffix: timestampSuffix,
      csvExtension: csvExtension,
      first: first,
    }

  }

  exportCSV = (data, page) => {
    let fileName = this.props.options.fileName + "_Page_" + page + "_" + moment().format(this.state.timestampSuffix) + ".csv";
    this.setState({ reportData: data }, () => {
      this.setState({ fileName: fileName }, () => {
        this.csvButton.current.link.click();
      });
    });
  }

  downloadCsv = async (opt) => {
    try{
    let payload;
    let opts = {};

    const { filters } = this.props;
    opts.page = opt.page + 1;

    delete opts.totalPages;

    opts.first = opt.page * opt.props.rows;
    opts.rows = this.state.rows

    opts.filters = filters;
    payload = {
      "lazyEvent": opts
    }

    if (opt.page === 0 && this.props.data && this.props.data.data) {
      this.exportCSV(this.props.data.data, opt.page + 1);
    } else {

      let apiResponse, apiResponseData;

      apiResponse = await this.state.service[this.state.method](payload)

      if (apiResponse && apiResponse.data && apiResponse.data.data) {
        apiResponseData = apiResponse.data.data;
        this.exportCSV(apiResponseData, opt.page + 1);
      }

    }
  } catch (err) {
    console.log(err)
  }
  }

  onPageChange = async (ev) => {
    await this.setState({ first: ev.first, rows: ev.rows });
  }

  render() {

    const { data } = this.props;

    const { rows, first, reportData, columns, fileName } = this.state;

    const CSVDownloadTemplate = {
      layout: 'PrevPageLink PageLinks NextPageLink',
      'PrevPageLink': (options) => {
        return (
          <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
            <span className="p-paginator-icon pi pi-angle-left"></span>
          </button>
        )
      },
      'NextPageLink': (options) => {
        return (
          <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
            <span className="p-paginator-icon pi pi-angle-right"></span>
          </button>
        )
      },
      'PageLinks': (options) => {

        if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
          const className = classNames(options.className, { 'p-disabled': false });
          return <span className={className} onClick={options.onClick}>...</span>;
        }

        return (
          <button type="button" className={"page-link " + options.className} onClick={options.onClick}>

            <span onClick={() => { this.downloadCsv(options) }}> <span className="cityone-fd-num">{options.page + 1}</span>
              <img src={fileDownload} alt="cityone-file-download" />
            </span>
          </button>
        )
      },
    };

    return (
      <>
        <div>
          {
            data.count
              ?
              <div className="csv-pagination-download">
                <Paginator template={CSVDownloadTemplate} first={first} rows={rows} totalRecords={data.count} onPageChange={this.onPageChange}></Paginator>
              </div>
              :
              <></>
          }
          <CSVLink ref={this.csvButton} filename={fileName} data={reportData} headers={columns}></CSVLink>
        </div>
      </>
    )
  }
}

export default ReportDownload;