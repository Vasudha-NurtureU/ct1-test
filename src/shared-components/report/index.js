import React, { Component } from 'react';

// utils 
import { isEmpty, merge, pickBy } from 'lodash';

import { toaster } from 'utils/toaster';

// components 
import ReportDownload from "shared-components/report/reportDownload";

// prime components 
import { Button } from 'primereact/button';

// shared components 
import CityoneLoading from 'shared-components/lazyLoading/Loading';

import CityoneDynamicForm from "shared-components/cityone-form/index";

// options
import { optionsDefaultValue } from 'shared-components/report/options';

class ReportForm extends Component {

  constructor(props) {

    super(props)

    this.state = {

      loading: false,

      reportOptions: merge({}, optionsDefaultValue, props.options),

      reportData: [],

      filterData: [],
    }

  }

  reportButtonGroup = () => (
    <div className="report-form-button-group">
      <Button type="submit" label="Generate Report" className="p-button p-button-primary" />
    </div>
  )

  getReportData = async (formData) => {

    try {

      let filterData, apiResponse, apiResponseData, payload;

      filterData = pickBy(formData, (item) => {
        return item !== null && item !== undefined && item !== ""
      })

      if (isEmpty(filterData)) {
        toaster.error("Provide minimum one filter")
        this.setState({ loading: false });
        return;
      }

      this.setState({ filterData: filterData })

      payload = {
        lazyEvent: {
          "first": 0,
          "page": 1,
          "rows": this.state.reportOptions.rows,
          "filters": filterData
        }
      }

      apiResponse = await this.state.reportOptions.service[this.state.reportOptions.method](payload)

      if (apiResponse && apiResponse.data) {
        apiResponseData = apiResponse.data;
        this.setState({ reportData: apiResponseData })
        if (!apiResponseData.isError && !apiResponseData.count) {
          toaster.info("No data available for your search")
        }
      }

    } catch (err) {
      console.log(err)
    }

    this.setState({ loading: false });

  }

  userFormOnsubmit = (data, error) => {
    if (isEmpty(error)) {
      this.setState({ loading: true });
      let formData = { ...this.props.initialValues, ...data };
      this.getReportData(formData)
    }
  }

  render() {

    const { reportOptions, reportData, filterData } = this.state;

    const { options, fields, initialValues } = this.props;

    return (
      <>
        {this.state.loading === true ? <CityoneLoading /> : <></>}

        <div className="report-section p-mt-3 p-mb-4">

          <div className="p-card p-mb-4">
            <div className="p-card-body">
              <h4 className="report-title">{options.title}</h4>
              <CityoneDynamicForm
                initialValues={initialValues}
                fields={fields}
                onFormSubmit={this.userFormOnsubmit}
                submitButtonGroup={this.reportButtonGroup}
              />
            </div>
          </div>

          <ReportDownload options={reportOptions} data={reportData} filters={filterData} />
        </div>
      </>
    );

  }
}

export default ReportForm;