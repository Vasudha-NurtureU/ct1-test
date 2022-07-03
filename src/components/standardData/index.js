import React, { Component } from 'react';

import { Switch } from "react-router-dom";

// components
import AuthGuard from 'auth-guard/index';

import Country     from 'components/standardData/country'    ;
import Tagcategory from 'components/standardData/tagCategory';

class StandardDataManagement extends Component {
  render() {
    return (
      <div>
        <Switch>
          <AuthGuard path='/standard-data/country' component={Country} />
          <AuthGuard path="/standard-data/tagcategory" component={Tagcategory} />
        </Switch>
      </div>
    )
  }
}

export default StandardDataManagement;