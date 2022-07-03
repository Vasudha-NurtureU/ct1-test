import React, { Component } from 'react';

import { withRouter } from 'react-router';

// state 
import { connect } from "react-redux";

// components
import Itinerary from 'components/packages/packageDetails/itinerary';
import Gallery from 'components/packages/packageDetails/gallery';
import Review from 'components/packages/packageDetails/review';
import Hoteloption from 'components/packages/packageDetails/hoteloption';

// prime components
import { TabView, TabPanel } from 'primereact/tabview';

// utils
import buildBreadcrumb from "utils/breadcrumb";

class PackageDetails extends Component {

  constructor(props) {

    super(props);

    // state management start
    this.state = {

      breadcrumbs: [
        { label: "Dashboard111", url: "dashboard", icon: 'pi pi-home' },
        { label: "Packages", url: "packages/listing" },
        { label: "Details", url: "" },
      ],

      packageId: this.props.match.params.id,

      activeIndex: null
    }
    // state management end
  }

  // list tabs based on privilege start
  listVisibleTabs = () => {
    let tabs = [
      {
        component: <Itinerary packageId={this.state.packageId} />,
        header: "Manage Itinerary"
      },
      {
        component: <Gallery packageId={this.state.packageId} />,
        header: "Gallery",
      },
      {
        component: <Review packageId={this.state.packageId} />,
        header: "Reviews",
      },
      {
        component: <Hoteloption packageId={this.state.packageId} />,
        header: "Hotel Options"
      }
    ]

    return tabs.map(tab => <TabPanel key={tab.header} header={tab.header}>{tab.component}</TabPanel>)
  }
  // list tabs based on privilege end

  componentDidMount = () => {
    buildBreadcrumb(this.props, this.state.breadcrumbs);
    const activeIndex = 0;
    this.setState({ activeIndex: activeIndex });
  }

  render() {

    return (
      <>

        <div className='tab-section'>

          <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
            {this.listVisibleTabs()}
          </TabView>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  zones: state.dropdownDetails.zone,
});

export default withRouter(connect(mapStateToProps)(PackageDetails));