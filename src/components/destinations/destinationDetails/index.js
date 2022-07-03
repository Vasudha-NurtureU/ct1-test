import React, { Component } from 'react';

import { withRouter } from 'react-router';

// state 
import { connect } from "react-redux";

// components
import Slider from 'components/destinations/destinationDetails/slider';
import ThingsToDo from 'components/destinations/destinationDetails/things';
import BestTime from 'components/destinations/destinationDetails/besttime';
import Usefulinfo from 'components/destinations/destinationDetails/usefulinfo';

// prime components
import { TabView, TabPanel } from 'primereact/tabview';

// utils

import buildBreadcrumb from "utils/breadcrumb";


class DestinationDetails extends Component {

  constructor(props) {

    super(props);

    // state management start
    this.state = {

      breadcrumbs: [
        { label: "Dashboard", url: "dashboard", icon: 'pi pi-home' },
        { label: "Destinations", url: "destinations/listing" },
        { label: "Details", url: "" },
      ],

      destinationId: this.props.match.params.id,

      activeIndex: null
    }
    // state management end
  }

  // list tabs based on privilege start
  listVisibleTabs = () => {
    let tabs = [
      {
        component: <Slider destinationId={this.state.destinationId} />,
        header: "Destination Slider"
      },
      {
        component: <BestTime destinationId={this.state.destinationId} />,
        header: "Best Time To Visit",
      },
      {
        component: <ThingsToDo destinationId={this.state.destinationId} />,
        header: "Things To Do",
      },
      {
        component: <Usefulinfo destinationId={this.state.destinationId} />,
        header: "Other Useful Info"
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

export default withRouter(connect(mapStateToProps)(DestinationDetails));