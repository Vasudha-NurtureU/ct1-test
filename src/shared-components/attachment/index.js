import React, { Component } from 'react';

// prime components
import { Button } from 'primereact/button';

import { Dialog } from 'primereact/dialog';

// shared components
import CityoneDynamicForm from 'shared-components/cityone-form';

//utils
import { merge, isEmpty, isString, isArray, isObject } from 'lodash';

import { downloadFile } from "utils/common";

import { getAttachmentIcon } from 'utils/common';

import { modalPopup } from "utils/modalPopup";

//options
import optionsDefaultValue from 'shared-components/attachment/options';

// constants
const imgTypes = ["jpg", "png", "jpeg", "gif"]

class Attachments extends Component {

  constructor(props) {

    super(props);

    // props destucture start
    const {
      service,
      method,
      urlPath,
      params,
      mediaURL,
      mediaPath,
      onDelete,
      noDataText,
      enableUpload,
      uploadFormOptions
    } = merge({}, optionsDefaultValue, this.props.options);
    // props destucture end

    // state management start
    this.state = {

      service: service,

      method: method,

      urlPath: urlPath,

      params: params,

      data: [],

      mediaURL: mediaURL,

      mediaPath: mediaPath,

      onDelete: onDelete,

      noDataText: noDataText,

      enableUpload: enableUpload,

      uploadFormOptions: uploadFormOptions,

      showUpload: false
    }
    // state management end
  }

  // attachment documents load start
  loadData = async () => {
    try {
      if (this.state.service && this.state.method) {

        let apiResponse, apiResponseData, rowItems = [], mediaItems;

        apiResponse = await this.state.service[this.state.method](this.state.urlPath, { ...this.state.params });

        if (apiResponse && apiResponse.data) {
          apiResponseData = apiResponse.data;
          if (isArray(apiResponseData.data))
            rowItems = apiResponseData.data;
          else if (isObject(apiResponseData.data))
            rowItems = [apiResponseData.data];
        }

        if (apiResponseData) {
          mediaItems = rowItems.map(rowData => {
            rowData.mediaLink = '';
            if (this.state.mediaURL && this.state.mediaPath && rowData.document_name) {
              rowData.mediaLink = this.state.mediaURL + this.state.mediaPath + "/" + rowData.document_name;
            }
            return rowData;
          });
          this.setState({ data: mediaItems })
        }
      }
    }
    catch {
      console.log("Something went wrong.");
    }
  }
  // attachment documents load start

  // attachment delete section start
  onDelete = attachment => {
    this.state.onDelete(attachment)
  }
  // attachment delete section end

  // attachment download section start
  onDownload = attachment => {
    downloadFile(attachment.mediaLink, attachment.document_name);
  }
  // attachment download section end

  onClose = () => {
    modalPopup.toggle(false)
    if (this.props.dataTableRef.current)
      this.props.dataTableRef.current.loadData()
  }

  uploadFormSubmitButtonGroup = () => {
    return (
      <div className="form-button-group">
        <Button type="submit" className='p-button p-button-primary p-mr-2' label="Upload" />
        <Button type="button" className='p-button p-button-secondary p-mr-2' label="Close" onClick={() => this.onUploadClose()} />
      </div>
    )
  }

  onUploadClose = () => {
    this.setState({ showUpload: false }, () => this.loadData())
  }
  onUpload = () => {
    this.setState({ showUpload: true })
  }

  onUploadFormSubmit = (data, error) => {
    this.state.uploadFormOptions.onSubmit(data, error)
  }

  componentDidMount() {
    this.loadData()
  }

  render() {
    return (
      <>
        <div className="form-wrapper">
          {
            isEmpty(this.state.data)
              ?
              <h4 className="p-text-center">{this.state.noDataText}</h4>
              :
              <div className="p-d-flex attachments-dialogue">
                {
                  this.state.data.map((rowData, index) => {
                    let fileType;
                    if (isString(rowData.document_name)) {
                      let fileName = rowData.document_name.split(".");
                      if (fileName.length > 0) {
                        fileType = fileName[fileName.length - 1]
                      }
                    }

                    return (
                      <div key={index} className="p-col-4 p-md-2 attachments-media">
                        {
                          (fileType && imgTypes.includes(fileType.toLowerCase()) && rowData.mediaLink)
                            ?
                            <img src={rowData.mediaLink} alt="Attachment file" />
                            :
                            getAttachmentIcon(fileType)
                        }
                        <div className='p-d-flex p-flex-wrap p-jc-between p-col-12'>
                          <div className='p-col-12 p-md-6'>
                            <Button label="" icon="pi pi-times" className='p-button-danger p-py-md-1 p-py-lg-2 p-pr-md-1 p-pl-md-2 p-pr-lg-2 p-pl-lg-3' onClick={() => this.onDelete(rowData)} />
                          </div>
                          <div className='p-col-12 p-md-6'>
                            <Button label="" icon="pi pi-download" className='p-button-success p-py-md-1 p-py-lg-2 p-pr-md-1 p-pl-md-2 p-pr-lg-2 p-pl-lg-3' onClick={() => this.onDownload(rowData)} /></div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
          }
          <div className="form-button-group">
            <Button type="button" className='p-button p-button-primary p-mr-2' label="Upload" onClick={this.onUpload} />
            <Button label="Close" className='p-button-secondary p-mr-2' onClick={this.onClose} />
          </div>
          {
            (this.state.enableUpload && this.state.showUpload) ?
              <Dialog header="Upload Attachment" className="attachment-upload-popup" visible={true} onHide={() => { }}>
                <CityoneDynamicForm
                  initialValues={this.state.uploadFormOptions.initialValues}
                  fields={this.state.uploadFormOptions.fields}
                  onFormSubmit={this.onUploadFormSubmit}
                  submitButtonGroup={this.uploadFormSubmitButtonGroup}
                />
              </Dialog>
              :
              <></>
          }
        </div>
      </>
    )
  }
}

export default Attachments;
