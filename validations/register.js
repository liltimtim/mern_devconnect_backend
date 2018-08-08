const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  let { name, email, password, confirmPassword } = data;

  // check if empty string first
  name = !isEmpty(name) ? name : "";
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";
  confirmPassword = !isEmpty(confirmPassword) ? confirmPassword : "";

  if (!Validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters.";
  }

  if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (Validator.isEmpty(name)) {
    errors.name = "Name field is required.";
  }

  if (Validator.isEmpty(email)) {
    errors.email = "Email field is required.";
  }

  if (Validator.isEmpty(password)) {
    errors.password = "Password field is required.";
  }

  if (Validator.isEmpty(confirmPassword)) {
    errors.confirmPassword = "Confirm Password field is required.";
  }

  // Password matches Confirm Password
  if (!Validator.matches(password, confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }

  if (!Validator.isEmail(email)) {
    errors.email = "Email must be in the format of example@domain.com";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
