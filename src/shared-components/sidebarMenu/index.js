import React from 'react';

import { Link, withRouter } from "react-router-dom";

import { connect } from 'react-redux';

import { PanelMenu } from 'primereact/panelmenu';

import { OPENSIDEBAR } from 'store/actions/type/app';

class CityoneSidebarMenu extends React.PureComponent {

    addTemplate = (menus) => {
        if (menus.length > 0) {

            // eslint-disable-next-line array-callback-return
            menus.map((menu) => {

                if (menu.items) {
                    menu.hasChild = true;
                } else {
                    menu.hasChild = false;
                }

                menu.template = (item, options) => {
                    return (
                        <div className="menu">
                            {(item.url !== undefined && item.url !== null) ?
                                <Link to={`/${item.url}`} className={`${options.className} menu-item`} onClick={
                                    () => {
                                        if (item.items) { options.onClick() }
                                        if (window.innerWidth < 1500) {
                                            this.props.dispatch({ type: OPENSIDEBAR, payload: false })
                                        }
                                    }
                                }>
                                    <div className="menu-title-wrapper">
                                        <i className={`menu-icon ${item.icon}`}></i>
                                        <span className="menu-title">{item.label}</span>
                                    </div>
                                    <div>
                                        {(item.hasChild) ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="up" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><polyline points="6 9 12 15 18 9"></polyline></svg> : null}
                                    </div>
                                </Link>
                                : <span className="menu-item" onClick={(item.items) ? options.onClick : null}>
                                    <div className="menu-title-wrapper">
                                        <i className={`menu-icon ${item.icon}`}></i>
                                        <span className="menu-title">{item.label}</span>
                                    </div>
                                    <div>
                                        {(item.hasChild) ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="up" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><polyline points="6 9 12 15 18 9"></polyline></svg> : null}
                                    </div>
                                </span>}
                        </div>
                    )
                }

                if (menu.items && menu.items.length > 0) {
                    this.addTemplate(menu.items);
                }

            })
        }
    }

    render() {

        if (Array.isArray(this.props.sidebarMenuList)) {
            this.addTemplate(this.props.sidebarMenuList)
        }

        return (
            <div className="hfc-sidebar-menu">
                <PanelMenu model={this.props.sidebarMenuList} />
            </div>
        );
    }
}

// export default Login
const mapStateToProps = (state) => ({
    ad: state.appDetails
});

export default withRouter(connect(mapStateToProps)(CityoneSidebarMenu));