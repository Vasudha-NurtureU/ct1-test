import React, { Component } from "react";

import { Switch } from "react-router-dom";

// components
import AuthGuard from "auth-guard/index";

import DestinationsListing from "components/destinations/listing";
import destinationDetails from "components/destinations/destinationDetails";

// shared components 
import CityoneLoader from "shared-components/lazyLoading";

class Destinations extends Component {
  render() {
    return (
      <div>
        <CityoneLoader>
          <Switch>
            <AuthGuard path="/destinations/listing" component={DestinationsListing} />
            <AuthGuard exact path='/destinations/details/:id' component={destinationDetails} />
          </Switch>
        </CityoneLoader>
      </div>
    )
  }
}

export default Destinations;
