import React, { Component } from 'react';

import { Route, Switch, Redirect } from "react-router-dom";

// state 
import { connect } from 'react-redux';

// components
import AuthGuard from 'auth-guard/index';

import Header from 'components/layouts/Header';

import Sidebar from 'components/layouts/Sidebar';

import Footer from 'components/layouts/Footer';

// shared components 
import CityoneLoader from 'shared-components/lazyLoading';

import CityoneBreadCrumb from "shared-components/breadcrumb";

// utils 
import lazy from 'utils/lazy';

const lazyDelay = 500;

// lazy components 
const Dashboard              = lazy('dashboard'         , lazyDelay);
const AssetsManagement       = lazy('assets'            , lazyDelay);
const User                   = lazy('user'              , lazyDelay);
const Enquiry                = lazy('enquiry'           , lazyDelay);
const Destinations           = lazy('destinations'      , lazyDelay);
const Bookings               = lazy('bookings'          , lazyDelay);
const Packages               = lazy('packages'          , lazyDelay);
const Customers              = lazy('customers'         , lazyDelay);
const Tags                   = lazy('tags'              , lazyDelay);
const CMS                    = lazy('cms'               , lazyDelay);
const Configurations         = lazy('configurations'    , lazyDelay);
const StandardDataManagement = lazy('standardData'      , lazyDelay);
const Statistics             = lazy('statistics'        , lazyDelay);
const AccountEdit            = lazy('account'           , lazyDelay);
class DashboardContainer extends Component {
  render() {

    return (
      <div className={`app-wrapper ${this.props.ad.isSidebarOpen ? "open" : ""}`}>

        <div className="sidebar-wrapper">
          <Sidebar />
        </div>

        <div className="layout">

          <div className="header">
            <Header />
          </div>

          <div className="main-wrapper">

            <div className="main-container">

              <div className="breadcrums-section">
                <CityoneBreadCrumb />
              </div>

              <CityoneLoader>
                <Switch>
                  <AuthGuard path='/dashboard'                  component={Dashboard             } />
                  <AuthGuard path='/assets'                     component={AssetsManagement      } />
                  <AuthGuard path='/user'                       component={User                  } />
                  <AuthGuard path='/enquiry'                    component={Enquiry               } />
                  <AuthGuard path='/destinations'               component={Destinations          } />
                  <AuthGuard path='/bookings'                   component={Bookings              } />
                  <AuthGuard path='/packages'                   component={Packages              } />
                  <AuthGuard path='/customers'                  component={Customers             } />
                  <AuthGuard path='/tags'                       component={Tags                  } />
                  <AuthGuard path='/cms'                        component={CMS                   } />
                  <AuthGuard path='/configurations'             component={Configurations        } />
                  <AuthGuard path='/standard-data'              component={StandardDataManagement} />
                  <AuthGuard path='/statistics'                 component={Statistics            } />
                  <AuthGuard path='/account'                    component={AccountEdit           } />
                  <Route exact path="/">
                    <Redirect to="/dashboard" />
                  </Route>
                </Switch>
              </CityoneLoader>

            </div>

            <div className="footer-section">
              <Footer />
            </div>

          </div>
        </div>
      </div>
    );
  }
}

// export default Login
const mapStateToProps = (state) => ({
  ld: state.loginDetails,
  ad: state.appDetails
});

export default connect(mapStateToProps)(DashboardContainer);
