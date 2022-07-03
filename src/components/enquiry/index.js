import React, { Component } from "react";

import { Switch } from "react-router-dom";

// components
import AuthGuard from "auth-guard/index";

import EnquiryListing from "components/enquiry/listing";

import Report from "components/enquiry/report";

// shared components 
import CityoneLoader from "shared-components/lazyLoading";


class Enquiry extends Component {
  render() {
    return (
      <div>
        <CityoneLoader>
          <Switch>
            <AuthGuard path="/enquiry/listing" component={EnquiryListing} />
            <AuthGuard path="/enquiry/report" component={Report} />
          </Switch>
        </CityoneLoader>
      </div>
    )
  }
}

export default Enquiry;
