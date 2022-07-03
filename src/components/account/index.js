import React, { Component } from 'react';

//components
import UpdateProfile from 'components/account/UpdateProfile';

import ResetPassword from 'components/login/ResetPassword';

//prime components
import { TabView, TabPanel } from 'primereact/tabview';

//shared components
import CityoneLoader from 'shared-components/lazyLoading';

//utils
import { isObject } from 'lodash';

import { response } from "utils/response";

import buildBreadcrumb from "utils/breadcrumb";

import { getUserID } from 'utils/common';

import UserService from 'services/user/user.service';

class AccountEdit extends Component {

  constructor(props) {

    super(props);

    //variable init start

    this.userService = new UserService();
    //variable init end

    //state management start
    this.state = {
      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Account", url: "account" }
      ],

      userInfo: {},

      loading: true,

      editProfile: false,
    };
    //state management end
  }

  getUserData = async () => {
    const apiResponse = await response.get({
      service: this.userService,
      method: 'getUser',
      data: { itemId: getUserID() }
    });

    if (apiResponse && apiResponse.data && !apiResponse.data.isError && isObject(apiResponse.data.data)) {
      this.setState({
        userInfo: apiResponse.data.data,
        loading: false,
        editProfile: true
      });
    }
  }

  setuserInfo = userInfo => {
    this.setState({ userInfo: userInfo });
  }

  componentDidMount() {
    buildBreadcrumb(null, this.state.breadcrumbs);
    this.getUserData();
  }

  render() {
    return (
      <>
        <div className='container'>
          {this.state.loading === true ? <CityoneLoader /> :
            <div className='tab-section'>
              <TabView>
                <TabPanel header="Edit Profile">
                  <UpdateProfile data={this.state.userInfo} setuserInfo={this.setuserInfo}/>
                </TabPanel>
                <TabPanel header="Reset Password">
                  <div className="profile-reset-password">
                    <ResetPassword editProfile={this.state.editProfile} />
                  </div>
                </TabPanel>
              </TabView>
            </div>}
        </div>
      </>
    )
  }

}

export default AccountEdit;