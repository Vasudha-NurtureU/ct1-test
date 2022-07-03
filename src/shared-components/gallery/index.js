import React, { Component } from 'react';

// state
import { connect } from "react-redux";

// prime components
import { Dialog } from 'primereact/dialog';

import { Button } from 'primereact/button';

//shared-components
import CityoneGallery from "shared-components/gallery/CityoneGallery"

//utils
import { galleryPopup } from "utils/galleryPopup";

class CityoneGalleryDialog extends Component {
  render() {
    const footer = (
      <Button
        label="Close"
        icon=""
        className='p-button-secondary p-mr-2'
        onClick={() => { galleryPopup.toggle(false) }}
      />)
    return (
      <div>
        {
          this.props.visible &&
          <Dialog
            showHeader={false}
            footer={footer}
            className="gallery-dialog"
            visible={true}
            onHide={() => this.props.onHide()}>
            <CityoneGallery />
          </Dialog>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  visible: state.galleryPopupDetails.visible,
  onHide: state.galleryPopupDetails.onHide
})

export default connect(mapStateToProps)(CityoneGalleryDialog);