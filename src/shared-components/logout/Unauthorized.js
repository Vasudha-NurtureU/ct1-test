import React, { Component } from 'react'

class Unauthorized extends Component {
  render() {
    return (
      <div>
        <div className="unauthorized-page-access">
          Unauthorized Access!
        </div>
        <p className="unauthorized-page-message p-text-center p-m-2">
          You don&apos;t have access to the screen. Please contact administrator for more details.
        </p>
      </div>
    )
  }
}

export default Unauthorized;
