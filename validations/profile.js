const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = data => {
  let errors = {};
  let {
    handle,
    status,
    skills,
    website,
    youtube,
    twitter,
    linkedin,
    facebook,
    instagram
  } = data;

  handle = !isEmpty(handle) ? handle : "";
  skills = !isEmpty(skills) ? skills : "";
  status = !isEmpty(status) ? status : "";

  if ((!Validator.isLength(handle), { min: 2, max: 40 })) {
    errors.handle = "Handle needs to between 2 and 40 characters";
  }

  if (Validator.isEmpty(handle)) {
    errors.handle = "Profile handle is required";
  }

  if (Validator.isEmpty(status)) {
    errors.status = "Status field is required.";
  }

  if (Validator.isEmpty(skills)) {
    errors.skills = "Skills field is required";
  }

  if (!isEmpty(website)) {
    if (!Validator.isURL(website)) {
      errors.website = "Not a valid URL";
    }
  }

  if (!isEmpty(youtube)) {
    if (!Validator.isURL(youtube)) {
      errors.youtube = "Not a valid URL";
    }
  }
  if (!isEmpty(facebook)) {
    if (!Validator.isURL(facebook)) {
      errors.facebook = "Not a valid URL";
    }
  }
  if (!isEmpty(linkedin)) {
    if (!Validator.isURL(linkedin)) {
      errors.linkedin = "Not a valid URL";
    }
  }
  if (!isEmpty(instagram)) {
    if (!Validator.isURL(instagram)) {
      errors.instagram = "Not a valid URL";
    }
  }
  if (!isEmpty(twitter)) {
    if (!Validator.isURL(twitter)) {
      errors.twitter = "Not a valid URL";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
