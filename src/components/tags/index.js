import React, { Component } from "react";

import { Switch } from "react-router-dom";

// components
import AuthGuard from "auth-guard/index";

import TagsListing from "components/tags/listing";

import Report from "components/enquiry/report";

// shared components 
import CityoneLoader from "shared-components/lazyLoading";


class Tags extends Component {
  render() {
    return (
      <div>
        <CityoneLoader>
          <Switch>
            <AuthGuard path="/tags/listing" component={TagsListing} />
            <AuthGuard path="/tags/report" component={Report} />
          </Switch>
        </CityoneLoader>
      </div>
    )
  }
}

export default Tags;
