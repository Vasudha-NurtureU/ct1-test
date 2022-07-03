const validationMessage = {
  required: "This field is required*",
  email: "Please enter a valid email id",
  phoneNo: "Please enter a valid Contact Number",
  number: "Please enter a number"
};

const validations = {

  required: {
    value: true,
    message: validationMessage.required
  },

  email: {
    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
    message: validationMessage.email
  },

  phoneNo: {
    value: /^[0-9]{10,14}$/,
    message: validationMessage.phoneNo
  },

  userName: {
    value: /^(?![\s.]+$)[a-zA-Z\s]*$/,
    message: validationMessage.userName
  },

  number: {
    value: /^\d+$/,
    message: validationMessage.number
  }

};


export {
  validations,
  validationMessage
}