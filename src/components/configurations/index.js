import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from "react-redux";

// utils 
import buildBreadcrumb from "utils/breadcrumb";

import { response } from "utils/response";

import { toaster } from 'utils/toaster';

import { isEmpty } from 'lodash';

//services
import SettingsService from 'services/settings/settings.service';

//prime components
import { Button } from 'primereact/button';

//shared components
import CityoneLoading from 'shared-components/lazyLoading/Loading';


class Configurations extends Component {

  constructor(props) {

    super(props);
    this.errors = [];

    //variable init start

    this.settingsService = new SettingsService();

    // variable init end

    this.state = {

      globalSettingsDatta: [],

      globalSettingsDatta1: {},

      loading: false,

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Configurations", url: "configurations", },
      ],
    }
  }

  loadGlobalSettings = async () => {
    this.setState({
      loading: true
    })
    const apiResponse = await this.settingsService.getGlobalconfig()
    if (apiResponse && apiResponse.data) {
      const globalSettingsDatta = apiResponse.data.data;
      this.setState({
        globalSettingsDatta: globalSettingsDatta,
        loading: false
      })
    } else {
      this.setState({
        loading: false
      })
    }
    apiResponse.data.data.map((data) => {
      return (
        this.setState(prevState => ({
          globalSettingsDatta1: {
            ...prevState.globalSettingsDatta1,
            [data.key]: data.value
          }
        })))
    })
  }

  changeData = (key, value) => {
    this.setState(prevState => ({
      globalSettingsDatta1: {
        ...prevState.globalSettingsDatta1,
        [key]: value
      }
    }))
  }
  submitGlobalSettings = () => {
    this.setState({
      loading: true
    })
    let data = this.state.globalSettingsDatta1;
    this.errors = []


    Object.keys(data).forEach((key) => {
      if (isEmpty(data[key])) {
        this.errors.push({
          [key]: "required"
        })
      }
    });
    if (this.errors.length === 0) {
      response.add({
        service: this.settingsService,
        method: 'getGlobalconfigUpdate',
        data: { item: data },
        toasterMessage: {
          success: 'Global Settings updated successfully',
          error: 'Global Settings not updated'
        }
      })
      this.setState({
        loading: false
      })
    } else {
      toaster.error("Please fill all the required fields")
      this.setState({
        loading: false
      })
    }
  }
  componentDidMount() {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    this.loadGlobalSettings();
  }
  render() {
    return (
      <div>

        <h3>Global Configuration Settings</h3>
        <br />
        {this.state.loading === true ? <CityoneLoading /> : <>
          {this.state.globalSettingsDatta.map((data, index) => {
            return (<div key={index} className="p-grid" >

              <label className="p-field-label p-col-12 p-md-6" ><em>*&nbsp;</em>{data.label} </label>
              <div className="p-col-12 p-md-6">
                {(() => {
                  switch (data.type) {
                    case "textarea":
                      return (<textarea
                        type="data.type"
                        rows='6'
                        style={{ width: '100%' }}
                        id={data.global_config_id}
                        className="p-inputtext p-component"
                        value={this.state.globalSettingsDatta1[data.key] || " "}
                        onChange={(e) => this.changeData(data.key, e.target.value)}
                      />)
                    case "textbox":
                      return <input className="p-inputtext p-component" style={{ width: '100%' }} type="data.type" id={data.global_config_id}
                        value={this.state.globalSettingsDatta1[data.key] || " "}
                        onChange={(e) => this.changeData(data.key, e.target.value)} />
                    default:
                      return <></>;
                  }
                })()
                }
              </div>


            </div>
            )
          })}
          <br />
          <br />
          <br />
          <div className="form-button-group">
            <Button type="button" label="Submit" className="p-button p-button-primary p-mr-2" onClick={() => this.submitGlobalSettings()}></Button>
          </div></>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(Configurations));