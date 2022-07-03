import React, { Suspense, Component } from 'react'

class DelayedFallback extends Component {
  render() {
    return (
      <>
        <div className="lds-roller-wrapper">
          <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      </>
    );
  }
}

class CityoneLoader extends Component {
  render() {
    return (
      <Suspense fallback={<DelayedFallback />}>{this.props.children}</Suspense>
    );
  }
}

export default CityoneLoader