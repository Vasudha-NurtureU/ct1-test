import React, { Component } from 'react';

import { withRouter } from "react-router";

// state 
import { connect } from 'react-redux';

import { OPENSIDEBAR } from 'store/actions/type/app';

// components

// prime components
import { Menu } from 'primereact/menu';

// storage 
import { lStorage } from 'utils/storage';

import { createImageFromInitials, getRandomColor } from 'utils/badgeTemplate';

// config
import config from "assets/config";

class Header extends Component {

  constructor(props) {

    super(props);

    // state management start
    this.state = {
      userValue: null,
      userMenuItems: [
        {
          items: [
            {
              label: 'My Account', icon: 'uil uil-user', command: () => {
                this.openAccount()
              }
            },
            {
              label: 'Logout', icon: 'uil uil-sign-out-alt', command: () => {
                this.logout()
              }
            },
          ]
        }
      ],
      userDetails: {}
    }
    // state management end

  }

  // user Log out section starts
  logout = () => {
    lStorage.clear();
    this.props.history.push('/login');
    //signOut();
  }
  // user Log out section end

  // user Account edit section starts
  openAccount = () => {
    this.props.history.push('/account')
  }
  // user Account edit section end

  // user Update the configuration settings section starts
  openSettings = () => {
    this.props.history.push('/configurations')
  }
  // user Update the configuration settings section end

  openSidebar = () => {
    if (this.props.ad.isSidebarOpen) {
      this.props.dispatch({ type: OPENSIDEBAR, payload: false })
    } else {
      this.props.dispatch({ type: OPENSIDEBAR, payload: true })
    }
  }

  userChange = async () => {
    console.log("data")
    this.setState({ userValue: "U" })
    let values = lStorage.get("authInfo")
    var userInfo = values;
    userInfo['user_type'] = "U";
    lStorage.set('authInfo', userInfo);
    this.props.history.push('/dashboard')
    window.location.reload()
  }
  componentDidMount() {
    const userDetails = lStorage.get('authInfo');
    this.setState({ userValue: userDetails.user_type })

    const configmenu = {
      label: 'Configurations', icon: 'uil uil-cog', command: () => {
        this.openSettings()
      }
    };

    const logoutMenu = {
      label: 'Logout', icon: 'uil uil-sign-out-alt', command: () => {
        this.logout()
      }
    };

    if ((userDetails.user_type === "U")) {
      let userMenuItems = [
        {
          items: [
            {
              label: 'My Account', icon: 'uil uil-user', command: () => {
                this.openAccount()
              }
            },
            
          ]
        }
      ];

      if(userDetails.role === "Superadmin") {
        userMenuItems[0].items.push(configmenu);
      } 
      userMenuItems[0].items.push(logoutMenu);
      
      this.setState({
        userDetails: userDetails,
        userMenuItems: userMenuItems
      });
    } else {
      this.setState({ userDetails: userDetails });
    }
  }

  render() {

    const { userDetails } = this.state;

    let typeRole = "";
    if (userDetails.user_type === "U") {
      typeRole = userDetails.role
    }
    else {
      const userType = config.userTypes.find(type => type.value === userDetails.user_type)
      typeRole = userType ? userType.label : "";
    }
    return (
      <nav className="header-nav">

        <div className="menu-toggler" onClick={this.openSidebar}>
          <i className="uil uil-bars"></i>
        </div>

        {userDetails && <div className="left-menu">

          <div className="user-info" onClick={(event) => this.menu.toggle(event)}>
            <span className="avator">
              <img id='preview' style={{ borderRadius: '23px' }}
                src={
                  createImageFromInitials(500, userDetails.name, getRandomColor())
                }
                alt='' />
            </span>
            <span className="user-name">
              <span className="name"> {userDetails.name} </span>
              <span className="role"> {typeRole} </span>
            </span>
          </div>

          <Menu className="user-menu" model={this.state.userMenuItems} popup ref={el => this.menu = el} />

        </div>
        }
      </nav>
    )
  }
}

// export default Login
const mapStateToProps = (state) => ({
  ad: state.appDetails
});

export default withRouter(connect(mapStateToProps)(Header));