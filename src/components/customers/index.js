import React, { Component } from "react";

import { Switch } from "react-router-dom";

// components
import AuthGuard from "auth-guard/index";

import CustomersListing from "components/customers/listing";

import Report from "components/customers/report";

// shared components 
import CityoneLoader from "shared-components/lazyLoading";


class Customers extends Component {
  render() {
    return (
      <div>
        <CityoneLoader>
          <Switch>
            <AuthGuard path="/customers/listing" component={CustomersListing} />
            <AuthGuard path="/customers/report" component={Report} />
          </Switch>
        </CityoneLoader>
      </div>
    )
  }
}

export default Customers;
