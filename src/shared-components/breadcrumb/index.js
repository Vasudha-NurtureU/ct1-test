import React, { Component } from "react";

import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { BreadCrumb } from "primereact/breadcrumb";

class CityoneBreadcrumb extends Component {

  render() {

    const { breadcrumb } = this.props.ad;

    const menuItems = breadcrumb.map((menu, index) => {
      return {
        ...menu,
        template: (item, options) => {
          return (
            (breadcrumb.length - 1 === index) ?  
            <Link to={`/${item.url}`} className={`disabled ${options.className}`} key={index} >
              <span className={options.labelClassName}>{item.label}</span>
            </Link> :  
            <Link to={`/${item.url}`} className={options.className} key={index} >
              <span className={options.labelClassName}>{item.label}</span>
            </Link>
          
          );
        },
      };
    })

    return (
      <div>
        <BreadCrumb model={menuItems} />
      </div>
    );

  }

}

const mapStateToProps = (state) => ({
  ld: state.loginDetails,
  ad: state.appDetails,
});

export default withRouter(connect(mapStateToProps)(CityoneBreadcrumb));
