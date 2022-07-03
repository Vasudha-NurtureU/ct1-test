import React, { Component } from 'react';

import { Switch, } from "react-router-dom";

// components 
import AuthGuard from 'auth-guard/index';

import AssetsManagementList from 'components/assets/listing';

import Category from 'components/assets/category';

// shared components 
import CityoneLoader from 'shared-components/lazyLoading';

class AssetsManagement extends Component {
  render() {
    return (
      <div>
        <CityoneLoader>
          <Switch>
            <AuthGuard path='/assets/listing' component={AssetsManagementList} />
            <AuthGuard path='/assets/category' component={Category} />
          </Switch>
        </CityoneLoader>
      </div>
    );
  }
}

export default AssetsManagement;

