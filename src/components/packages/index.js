import React, { Component } from "react";

import { Switch } from "react-router-dom";

// components
import AuthGuard from "auth-guard/index";

import PackagesListing from "components/packages/listing";
import PackageDetails from "components/packages/packageDetails";

// shared components 
import CityoneLoader from "shared-components/lazyLoading";

class Packages extends Component {
  render() {
    return (
      <div>
        <CityoneLoader>
          <Switch>
            <AuthGuard path="/packages/listing" component={PackagesListing} />
            <AuthGuard exact path='/packages/details/:id' component={PackageDetails} />
          </Switch>
        </CityoneLoader>
      </div>
    )
  }
}

export default Packages;
