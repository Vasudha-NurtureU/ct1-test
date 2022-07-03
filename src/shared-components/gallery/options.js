const options = {
  visible: false,
  rowData: [],
  onHide: () => {  },
  filters: [
    {
      className: "gallery-filter-dropdown",
      field: "asset_category_id",
      placeholder: "Asset Category",
      dropdownOptions: "assetCategory"
    }
  ],

  lazyEvent: {
    rows: 60,
    page: 1,
    filters : {
      asset_category_id: {
        value: ""
      },
      label: {
        value: ""
      },
      status_id: {
        value: 1,
      }
    }
  },

  actionBtnOptions: [
    {
      icon: "pi pi-copy",
      className: "p-button-primary p-mr-3 p-ml-2",
      disabled: false,
      title : 'Copy Link'
    },
    {
      icon: "pi pi-plus",
      className: "p-button-primary p-mr-2",
      disabled: false,
      title : 'Attach'
    }
  ],
}

export {
  options
}