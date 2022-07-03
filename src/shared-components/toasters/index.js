import React, { Component } from 'react';

// store 
import { connect } from 'react-redux';

// shared component 
import { Toast } from 'primereact/toast';

class CityoneToaster extends Component {

  constructor(props) {

    super(props);

    this.toast = React.createRef(null);

    this.state = {
      toastOptions: {
        ref: this.toast,
        onHide: () => {
        }
      }
    }
    
  }
  
  componentDidMount() {
    this.props.dispatch({ type: "SETTOASTERREF", payload: { toasterRef: this.toast } })
  }
  
  render() {
    return (
      <div>
        <Toast {...this.state.toastOptions} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  td: state.toasterDetails
});

export default connect(mapStateToProps)(CityoneToaster);