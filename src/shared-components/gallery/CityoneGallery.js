import React, { Component } from 'react';
import { connect } from "react-redux";

//utils
import { isEmpty, isArray } from 'lodash';

import { getMediaIcon } from 'utils/common';

import { toaster } from "utils/toaster";

// prime components
import { Button } from 'primereact/button';

import { Dropdown } from 'primereact/dropdown';

import { InputText } from 'primereact/inputtext';

//options
import { options } from 'shared-components/gallery/options';

import config from 'assets/config';

//services
import GalleryService from 'services/gallery/gallery.service';

const imgTypes = ["jpg", "png", "jpeg", "gif"]


class CityoneGallery extends Component {

  constructor(props) {

    super(props);

    // variable initialization start
    const { filters, lazyEvent } = options;
    // variable initialization end

    // state management start
    this.state = {
      totalRecords: 0,
      data: [],
      loading: false,
      selection: null,
      filters: filters,
      mediaURL: config.mediaURL,
      mediaPath: "digital-asset",
      lazyEvent: lazyEvent
    }
    // state management end
  }

  // gallery media items load start
  loadData = async () => {
    try {
      const galleryService = new GalleryService();

      let apiResponse, apiResponseData, rowItems = [], mediaItems;

      apiResponse = await galleryService.getMediaList({ lazyEvent: this.state.lazyEvent })

      if (apiResponse && apiResponse.data) {
        apiResponseData = apiResponse.data;
        if (isArray(apiResponseData.data))
          rowItems = apiResponseData.data;
        else if (isEmpty(apiResponseData.data))
          rowItems = [apiResponseData.data];
      }

      if (apiResponseData) {
        mediaItems = rowItems.map(rowData => {
          rowData.mediaLink = '';
          if (this.state.mediaURL && this.state.mediaPath && rowData.file_name) {
            rowData.mediaLink = this.state.mediaURL + this.state.mediaPath + "/" + rowData.file_name;
          }
          return rowData;
        });
        this.setState({
          totalRecords: parseInt(apiResponseData.count),
          data: this.state.lazyEvent.page > 1 ? this.state.data.concat(mediaItems) : mediaItems,
          hasMore: (apiResponseData.count - (this.state.lazyEvent.page * this.state.lazyEvent.rows)) > 0 ? true : false,
        })
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  onLoadMore = () => {
    this.setState({
      lazyEvent: {
        ...this.state.lazyEvent,
        page: this.state.lazyEvent.page + 1,
      }
    }, this.loadData);
  }
  // gallery media items load end

  // search and filter section start
  handleSearchChange = (ev) => {
    this.setState({
      lazyEvent: {
        ...this.state.lazyEvent,
        filters: {
          ...this.state.lazyEvent.filters,
          label: {
            value: ev.target.value
          }
        }
      }
    });
  }

  onSearch = () => {
    this.setState({
      lazyEvent: {
        ...this.state.lazyEvent,
        page: 1
      }
    }, this.loadData);
  }

  handleFilterElement = (ev, field) => {
    this.setState({
      lazyEvent: {
        ...this.state.lazyEvent,
        page: 1,
        filters: {
          ...this.state.lazyEvent.filters,
          [field]: {
            value: ev.target.value
          }
        }
      }
    }, this.loadData);
  }
  // search and filter section end

  // set selection start
  setSelection = row => {
    this.setState({ selection: row })
  }
  // set selection end

  // copy and attach section start
  onLinkCopy = (mediaLink) => {
    let textElement = document.createElement('textarea');
    textElement.value = mediaLink;
    document.body.appendChild(textElement);
    textElement.select();
    if (document.execCommand('copy')) {
      toaster.success("Link copied successfully")
    }
    document.body.removeChild(textElement);
    this.props.onLinkCopy(mediaLink)
  }

  onAttachmentCopy = selection => {
    this.props.onAttachmentCopy(selection)
  }
  // copy and attach section end

  componentDidMount() {
    this.loadData()
  }

  render() {
    return (
      <>
        <div className="p-d-flex p-jc-between gallery-filter-section">
          <div className="p-d-flex gallery-search-section">
            <h4 className="gallery-heading">Media Library</h4>
            <div className="p-d-flex">
              <InputText
                value={this.state.lazyEvent.filters.label.value}
                onChange={(ev) => { this.handleSearchChange(ev) }}
                placeholder="Name"
                className="p-ml-3"
              />
              <Button
                label="Search"
                icon="pi pi-search"
                className='p-button-primary p-mr-2 p-ml-2'
                onClick={(ev) => { this.onSearch(ev) }}
              />
            </div>
          </div>
          <div className="gallery-filters">
            {
              this.state.filters.map((filter, index) => {
                let defaultOption = [{ label: "All", value: "" }];
                let filterOptions = [];

                filterOptions = (!isEmpty(this.props.dd[filter.dropdownOptions])) ? this.props.dd[filter.dropdownOptions] : [];
                return (
                  <Dropdown
                    key={index}
                    className={filter.className || ""}
                    options={[...defaultOption, ...filterOptions]}
                    optionLabel="label"
                    value={this.state.lazyEvent.filters[filter.field].value}
                    onChange={(ev) => { this.handleFilterElement(ev, filter.field) }}
                    placeholder={filter.placeholder}
                  >
                  </Dropdown>
                )
              })
            }
          </div>
        </div>
        <div className="p-d-flex">
          <div className="p-col-8 gallery-media-scroll-container">
            <div className="p-d-flex gallery-media-container">
              {this.state.data &&
                this.state.data.map(rowData => {
                  let selectClass = "";

                  if (!isEmpty(this.state.selection) && this.state.selection.asset_id === rowData.asset_id) {
                    selectClass = "gallery-media-selected"
                  }

                  return (<div key={rowData.asset_id} className={"p-col-4 p-md-2 gallery-media " + selectClass} onClick={() => this.setSelection(rowData)}>
                    {((imgTypes.indexOf(rowData.file_type.toLowerCase()) !== -1) && rowData.mediaLink) ?
                      <img src={rowData.mediaLink} className="gallery-media-icon" alt="media file" />
                      :
                      getMediaIcon(rowData)}
                  </div>)
                })
              }
              {this.state.hasMore &&
                <div className="p-col-12">
                  <Button
                    label="Load More"
                    icon="pi pi-angle-double-down"
                    className='p-button-primary p-mt-3 p-mb-1 p-mr-2 p-ml-2'
                    onClick={() => { this.onLoadMore() }}
                  />
                </div>}
            </div>
          </div>
          <div className="p-col-4 gallery-info-panel" >
            <div>
              <div className="gallery-info-box">
                <h4 className="gallery-info-line-box">MEDIA DETAILS</h4>
                {
                  isEmpty(this.state.selection)
                    ?
                    <div className="gallery-info-line-box">
                      Select Media to view details.
                    </div>
                    :
                    <table className="cityone-gallery-info-table">
                      <tbody>
                        <tr>
                          <td className="gallery-info-label">Name </td>
                          <td className="gallery-info-value">{this.state.selection.label || "-"}</td>
                        </tr>
                        <tr>
                          <td className="gallery-info-label">Description </td>
                          <td className="gallery-info-value">{this.state.selection.description || "-"}</td>
                        </tr>
                        <tr>
                          <td className="gallery-info-label">File Name </td>
                          <td className="gallery-info-value">{this.state.selection.file_name || "-"}</td>
                        </tr>
                        <tr>
                          <td className="gallery-info-label">File Type </td>
                          <td className="gallery-info-value">{this.state.selection.file_type || "-"}</td>
                        </tr>
                        <tr>
                          <td className="gallery-info-label">Created By </td>
                          <td className="gallery-info-value">{this.state.selection.created_by || "-"}</td>
                        </tr>
                      </tbody>
                    </table>
                }
                <div className="gallery-button-group-box p-mt-1">
                  <Button
                    label="Copy Link"
                    icon="pi pi-copy"
                    style={{display:'none'}}
                    className='p-button-primary p-mt-1 p-mb-1 p-mr-3 p-ml-2'
                    disabled={isEmpty(this.state.selection)}
                    onClick={() => { this.onLinkCopy(this.state.selection.mediaLink) }}
                  />
                  <Button
                    label="Attach"
                    icon="pi pi-plus"
                    className='p-button-primary p-mr-2 p-mt-1 p-ml-2 p-mb-1'
                    disabled={isEmpty(this.state.selection)}
                    onClick={() => { this.onAttachmentCopy(this.state.selection) }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  dd: state.dropdownDetails,
  onLinkCopy: state.galleryPopupDetails.onLinkCopy,
  onAttachmentCopy: state.galleryPopupDetails.onAttachmentCopy,
});

export default connect(mapStateToProps)(CityoneGallery);