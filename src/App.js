import React, { Component } from 'react';

import {
  Switch,
  Redirect
} from "react-router-dom";

import { withRouter } from "react-router";

// state 
import { connect } from 'react-redux';

// utils 
import lazy from 'utils/lazy';

// components 
import AuthGuard from 'auth-guard/index';

import Login from 'components/login/Login';

import ForgetPassword from 'components/login/ForgetPassword';

import ResetPassword from 'components/login/ResetPassword';


// shared components 
import CityoneErrorBoundary from 'shared-components/errorBoundary';

import CityoneLoader from 'shared-components/lazyLoading';

import CityoneToaster from 'shared-components/toasters';

import CityoneConfirmDialog from 'shared-components/confirmDialog';

import CityoneGallery from 'shared-components/gallery';

import TokenExpire from 'shared-components/logout/tokenExpire';

// lazy components 
const LayoutContainer = lazy('layouts/Template');

class App extends Component {

  render() {

    return (
      <CityoneErrorBoundary>
        <CityoneLoader>
          <div className="cityone">
            <Switch>

              <Login path="/login"></Login>

              <ForgetPassword path="/forgot-password"></ForgetPassword>

              <ResetPassword path="/reset-password/:id"></ResetPassword>

              <AuthGuard path='/' component={LayoutContainer} />

              <Redirect to="login"></Redirect>

            </Switch>
          </div>

          <div>
            <CityoneToaster />
            <CityoneConfirmDialog />
            <CityoneGallery />
            <TokenExpire />
          </div>

        </CityoneLoader>
      </CityoneErrorBoundary>
    );
  }
}

// export default Login
const mapStateToProps = (state) => ({
  ld: state.loginDetails
});

export default withRouter(connect(mapStateToProps)(App));
