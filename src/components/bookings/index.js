import React, { Component } from "react";

import { Switch } from "react-router-dom";

// components
import AuthGuard from "auth-guard/index";

import BookingsListing from "components/bookings/listing";
import BookingDetails from "components/bookings/bookingDetails"

import Report from "components/bookings/report";

// shared components 
import CityoneLoader from "shared-components/lazyLoading";


class Bookings extends Component {
  render() {
    return (
      <div>
        <CityoneLoader>
          <Switch>
            <AuthGuard path="/bookings/listing" component={BookingsListing} />
            <AuthGuard path="/bookings/report" component={Report} />
            <AuthGuard exact path='/bookings/details/:id' component={BookingDetails} />
          </Switch>
        </CityoneLoader>
      </div>
    )
  }
}

export default Bookings;
