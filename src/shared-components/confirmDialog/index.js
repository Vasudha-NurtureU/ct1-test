import React, { Component } from 'react';

// store 
import { connect } from 'react-redux';

import { ConfirmDialog } from 'primereact/confirmdialog';

class CityoneConfirmDialog extends Component {
  render() {
    return (
      <div>
        <ConfirmDialog {...this.props.cd} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cd: state.confirmDialogDetails
});

export default connect(mapStateToProps)(CityoneConfirmDialog);