import React, { Component } from "react";

import { Switch } from "react-router-dom";

// components
import AuthGuard from "auth-guard/index";

import UserListing from "components/user/listing/";

import Report from "components/user/report";

// shared components 
import CityoneLoader from "shared-components/lazyLoading";


class User extends Component {
  render() {
    return (
      <div>
        <CityoneLoader>
          <Switch>
            <AuthGuard path="/user/listing" component={UserListing} />
            <AuthGuard path="/user/report" component={Report} />
          </Switch>
        </CityoneLoader>
      </div>
    )
  }
}

export default User;
