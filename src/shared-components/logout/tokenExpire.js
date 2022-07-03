import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from 'react-redux';

// prime components
import { Dialog } from 'primereact/dialog';

import { Button } from 'primereact/button';

// utils
import { showLogin } from 'utils/common';

class TokenExpire extends Component {
  login = () => {
    showLogin();
    this.props.history.push('/login');
  }
  render() {
    return (
      <div>
      <Dialog 
      showHeader={false} 
      className="token-expire-popup"
      position="top"
      visible={this.props.ld.expired} onHide={()=> {}} >
        <div className="token-expire-box">
          Session has been expired!
        </div>
        <div className="token-expire-login">
          <Button type="submit" label="Login" className="p-button p-button-primary p-mt-4 p-mb-2" onClick={this.login} />
        </div>
      </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ld: state.loginDetails,
});

export default withRouter(connect(mapStateToProps)(TokenExpire));
