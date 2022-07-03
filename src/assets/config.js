// eslint-disable-next-line no-undef
const configData = process.env;
const environment = 'production'; // local qa production
let config = {
  local: {
    apiURL: configData.REACT_APP_API_BASE_URI || "http://localhost/cityone-api/public/v1/",
    mediaURL: configData.REACT_APP_MEDIA_URL || "https://sve112dam.s3.ap-south-1.amazonaws.com/",
    maxAllowedFileSize: 20,
    profileImageMaxFIleSize: 1,
    userTypes:[
      { label: "Admin", value: "U" }
    ]
  },
  qa: {
    apiURL: configData.REACT_APP_API_BASE_URI || "https://dev.nurtureu.tech/SVE112/public/v1/",
    mediaURL: configData.REACT_APP_MEDIA_URL || "https://sve112dam.s3.ap-south-1.amazonaws.com/",
    maxAllowedFileSize: 20,
    profileImageMaxFIleSize: 1,
    userTypes: [
      { label: "Admin", value: "U" }
    ]
  },
  production: {
    apiURL: configData.REACT_APP_API_BASE_URI || "https://api.cityoneholidays.com/public/v1/",
    mediaURL: configData.REACT_APP_MEDIA_URL || "https://static.cityoneholidays.com/",
    maxAllowedFileSize: 20,
    profileImageMaxFIleSize: 1,
    userTypes: [
      { label: "Admin", value: "U" }
    ]
  }
};

export default config[environment];
