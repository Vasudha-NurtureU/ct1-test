import React from 'react';

//utils
import { isEmpty, isString, upperFirst } from 'lodash';

import { getDateString, getFileTypeIcon, formatBookingId } from "utils/common";

import config from 'assets/config';

const image_folder="digital-asset"


const statusBadge = (rowData, { field }) => {
  let status = rowData[field];
  let slug = '';
  if (!isEmpty(rowData.status)) {
    if (!isEmpty(rowData.status.status_name)) status = rowData.status.status_name;
    if (!isEmpty(rowData.status.status_slug)) slug = "p-badge status-" + rowData.status.status_slug;
  }

  return slug ? <div className={slug}>{status}</div> : status;
}

const yesNoBadge = (rowData, { field }) => {
  if (rowData[field] === 1 || rowData[field] === 2)
    return (rowData[field] === 2) ? "Yes" : "No";
  else
    return "-";
}

const imageBadge = (rowData) => {
  return (!isEmpty(rowData.image) ? <img width="120" src={config.mediaURL + image_folder + '/'  + rowData.image} /> : "-");
}

const bannerImageBadge = (rowData) => {
  return (!isEmpty(rowData.banner_image) ? <img width="120" src={config.mediaURL + image_folder + '/'  + rowData.banner_image} /> : "-");
}

const tagCategoryBadge = (rowData) => {
  return (!isEmpty(rowData.tag_category) && !isEmpty(rowData.tag_category.name)) ? <div className="cityone-datatable-td" title={rowData.tag_category.name}>{rowData.tag_category.name}</div> : "-";
}

const destinationBadge = (rowData) => {
  return (!isEmpty(rowData.destination) && !isEmpty(rowData.destination.name)) ? <div className="cityone-datatable-td" title={rowData.destination.name}>{rowData.destination.name}</div> : "-";
}

const customerBadge = (rowData) => {
  return (!isEmpty(rowData.customer) && !isEmpty(rowData.customer.first_name)) ? <div className="cityone-datatable-td" title={rowData.customer.first_name}>{rowData.customer.first_name} {rowData.customer.last_name}</div> : "-";
}

const packageBadge = (rowData) => {
  return (!isEmpty(rowData.packages) && !isEmpty(rowData.packages.name)) ? <div className="cityone-datatable-td" title={rowData.packages.name}>{rowData.packages.name}</div> : "-";
}

const userStatusBadge = (rowData) => {
  return (!isEmpty(rowData.status) && !isEmpty(rowData.status.status_name)) ? <div className="cityone-datatable-td" title={rowData.status.status_name}>{rowData.status.status_name}</div> : "-";
}

const bookingIdBadge = (rowData) => {
  return  (rowData.booking_id ? <div className="cityone-datatable-td" title={rowData.booking_id}>{formatBookingId(rowData.booking_id)}</div> : '-');
}

const createdDateBadge = (rowData, { field }) => {
  return (!isEmpty(rowData[field])) ? <div className="cityone-datatable-td" title={getDateString(rowData[field])}>{getDateString(rowData[field])}</div> : "-";
}

const countryBadge = (rowData) => {
  return (!isEmpty(rowData.country) && !isEmpty(rowData.country.country_name)) ? <div className="cityone-datatable-td" title={rowData.country.country_name}>{rowData.country.country_name}</div> : "-";
}

const filetypeBadge = (rowData, { field }) => {
  return (!isEmpty(rowData[field])) ? <div className="cityone-datatable-td">{getFileTypeIcon(rowData)}</div> : "-";
}

const imagetypeBadge = (rowData, { field }) => {
  return <img src={config.mediaURL + image_folder + "/" + rowData[field]} alt="image-media" width="150" height="160" />
}

const assetCategoryBadge = rowData => {
  return (!isEmpty(rowData.cat_names) && !isEmpty(rowData.cat_names.label)) ? <div className="cityone-datatable-td" title={rowData.cat_names.label}>{rowData.cat_names.label}</div> : "-";
}

const assetListingCategoryBadge = rowData => {
  return (!isEmpty(rowData.cat_name) && !isEmpty(rowData.cat_name.label)) ? <div className="cityone-datatable-td" title={rowData.cat_name.label}>{rowData.cat_name.label}</div> : "-";
}

const lookup = (obj, key) => {
  return key.split('.').reduce((o, k) => o && o[k], obj);
}

const gotoPage = (rowData, field, cb) => {

  let data = lookup(rowData, field), fieldName;

  if ((data || (data === 0)) && isString(data)) {
    fieldName = upperFirst(data);
  } else {
    fieldName = data
  }

  if (fieldName) {
    return (
      <span className="gotopage-link">
        <span title={fieldName} onClick={(ev) => { cb(ev, rowData) }}>{fieldName}</span>
      </span>
    )
  } else {
    return (<span>-</span>)
  }

}

const startDateValidate = rowData => {
  let todayDate = new Date()
  return (todayDate.toISOString() < rowData) ? true : false
}




const htmlConvertor = rowData => {
  if (!isEmpty(rowData.answer)) {
    return <div dangerouslySetInnerHTML={{ __html: rowData.answer }}></div>
  } else {
    return "-";
  }
}
const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 15)];
  }
  return color;
}

const getInitials = (name) => {
  let initials;
  const nameSplit = name.split(" ");
  const nameLength = nameSplit.length;
  if (nameLength > 1) {
    initials =
      nameSplit[0].substring(0, 1);
  } else if (nameLength === 1) {
    initials = nameSplit[0].substring(0, 1);
  } else return;

  return initials.toUpperCase();
};

const createImageFromInitials = (size, name, color) => {
  if (name == null) return;
  name = getInitials(name)

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = canvas.height = size

  context.fillStyle = "#ffffff"
  context.fillRect(0, 0, size, size)

  context.fillStyle = `${color}50`
  context.fillRect(0, 0, size, size)

  context.fillStyle = color;
  context.textBaseline = 'middle'
  context.textAlign = 'center'
  context.font = `${size / 2}px Pacifico`
  context.fillText(name, (size / 2), (size / 2))

  return canvas.toDataURL()
};

export {
  statusBadge,
  tagCategoryBadge,
  destinationBadge,
  customerBadge,
  packageBadge,
  yesNoBadge,
  bookingIdBadge,
  createdDateBadge,
  countryBadge,
  filetypeBadge,
  userStatusBadge,
  imagetypeBadge,
  imageBadge,
  bannerImageBadge,
  assetCategoryBadge,
  assetListingCategoryBadge,
  gotoPage,
  startDateValidate,
  htmlConvertor,
  getRandomColor,
  createImageFromInitials,
  getInitials,
}

