import React from 'react';

import { Link } from 'react-router-dom';

import { sidebarRoutes } from 'routes/sidebar';

// shared components
import CityoneSidebarMenu from "shared-components/sidebarMenu";

// utils 
import { getUserType, getUserRole, getUserPrivilages, getModuleAccess } from 'utils/common';

import { isArray } from 'lodash';

// images 
import logo from 'assets/images/logo-white.png';

class Sidebar extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      sidebarRoute: []
    }
  }

  getSidebarMenu = () => {

    try {

      let userMenuList, userTypeMenu, userTypeMenuList, userType, userRole;

      userType = getUserType();
      userRole = getUserRole();

      if (isArray(sidebarRoutes)) {

        userMenuList = sidebarRoutes.filter((menu) => {
          return menu.userType === userType
        })

        userTypeMenu = getUserPrivilages().map((moduleName => {
          return (moduleName.module) ? moduleName.module.toLowerCase() : moduleName.module
        }))

        userTypeMenuList = userMenuList[0].route.filter((menu) => {
          let menuLabel = (menu.label) ? menu.label.toLowerCase() : menu.label;
          return (menuLabel === "dashboard") ? true : userTypeMenu.includes(menuLabel);
        })

        userRole === 'Admin' ? userTypeMenuList.pop() : userTypeMenuList;
        userTypeMenuList = userTypeMenuList.map(menu => {
          if (Array.isArray(menu.items)) {
            return {
              ...menu,
              items: menu.items.filter(subMenu => {
                if (subMenu.slug) {
                  let moduleAccess = getModuleAccess(menu.label.toUpperCase());
                  return moduleAccess.access.includes(subMenu.slug);
                }
                return true;
              })
            }
          }
          return menu;
        })

        this.setState({ sidebarRoute: userTypeMenuList })

      }

    } catch (err) {
      console.log(err)
    }

  }

  componentDidMount() {
    this.getSidebarMenu()
  }

  render() {
    return (
      <div className="sidebar">
        <div className="header-section">
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
        </div>
        <div className="panel-menu">
          <CityoneSidebarMenu sidebarMenuList={this.state.sidebarRoute} />
        </div>
      </div>
    );
  }
}

export default Sidebar