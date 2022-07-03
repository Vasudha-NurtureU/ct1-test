import config from 'assets/config';

const optionsDefaultValue = {

  service: null,

  method: null,

  urlPath: null,

  params: null,

  data: [],

  mediaURL: config.mediaURL,

  mediaPath: "digital-asset",

  onDelete: () => { },

  noDataText: "No attachments assigned",

  enableUpload: false,

  uploadFormOptions: {

    initialValues: {},

    fields: {},

    onSubmit: () => { }

  }
}

export default optionsDefaultValue;