import React from 'react';

import { withRouter } from "react-router";


class CityoneErrorBoundary extends React.Component {
  constructor(props) {

    super(props);

    // state management start
    this.state = { 
      error: null, 
      errorInfo: null
     }
     // state management end
  }

  goToDashboard = () => {
    this.setState({
      error: null,
      errorInfo: null
    }, () => { this.props.history.push("") })
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div className="error-boundary-section p-mt-4">
          <div className="p-p-4 p-p-4">
            <div className="p-text-center p-text-normal"> Oops! Something went wrong </div>
          </div>

        </div>
      );
    }
    return this.props.children;
  }
}

export default withRouter(CityoneErrorBoundary);