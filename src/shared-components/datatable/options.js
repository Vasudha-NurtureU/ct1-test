const optionsDefaultValue = {

  privilege: {
    isActive: false,
    moduleName: {
      module: "",
      access: [],
    },
  },

  tablePrimeConfig: {
    emptyMessage: 'No data are found.'
  },

  url: null,

  method: null,

  urlPath: '',

  params: null,

  lazyParams: {
    first: 0,
    rows: 50,
    page: 1,
    filters: {

    }
  },

  columns: [],

  pagination: {

    prevPageLink: {
      isPrevPageLink: true,
      classNames: ''
    },

    nextPageLink: {
      isNextPageLink: true,
      classNames: ''
    },

    pageLinks: {
      isPageLinks: true,
      classNames: ''
    },

    rowsPerPageDropdown: {
      isRowPerPage: true,
      dropdownOptions: [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
      ],
      classNames: ''
    },

    currentPageReport: {
      isPageResult: true,
      shortResult: false,
      isPageNavigator: false,
      classNames: ''
    }

  },

  enableActionColumn: true,

  actionBtnOptions: [
    {
      type: 'update',
      icon: "uil uil-pen edit-icon",
      className: "p-mr-23",
      disabled: false,
      title: 'Edit Item',
    },
    {
      type: 'delete',
      icon: "uil uil-trash-alt remove-icon",
      className: "p-mr-23",
      disabled: false,
      title: 'Delete Item',
    }
  ],

  toolBarBtnOptions: {
    selection: {
      title: "Bulk Action:",
      enableBulkEdit: true,
      enableUpdate: true,
      enableDelete: true,
      enableReport: false,
      titleClassNames: "bulk-action-title",
      field: {
        classNames: "",
        options: [],
        label: "label",
        placeholder: "Select Status",
      },
      updateBtnsOptions: {
        type: 'update',
        label: "Update",
        icon: "",
        classNames: 'p-button-primary p-ml-3',
        onClick: () => {
          console.log("Please provide button action")
        }
      },
      deleteBtnsOptions: {
        type: 'delete',
        label: "Delete",
        icon: "pi pi-times",
        classNames: 'p-button-danger p-ml-3',
        onClick: () => {
          console.log("Please provide button action")
        }
      },
      reportBtnsOptions: {
        label: "Export",
        icon: "pi pi-file-o",
        classNames: 'p-button p-button-primary p-ml-3 p-mr-3',
        headers: null,
        fileName: "Report",
        timestampSuffix: "",
        fileExtension: ".csv",
        generateReportData: null,
        onClick: () => { }
      }
    },
    rightBtnsOptions: [
      {
        type: 'create',
        label: 'Add New',
        icon: 'pi pi-plus',
        classNames: 'p-button-primary p-ml-3',
        visibility: true,
      }
    ]
  },
  enableSelection: false,

}

export {
  optionsDefaultValue
}