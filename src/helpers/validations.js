import Joi from "@hapi/joi";
import { serverResponse } from "./Response";
// schema
const project = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
});
const issue = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  projectID: Joi.number().required(),
  screenshot: Joi.string(),
});
const iUpdate = Joi.object().keys({
  title: Joi.string(),
  description: Joi.string(),
  screenshot: Joi.string(),
});
const login = Joi.object().keys({
  password: Joi.required(),
  email: Joi.string()
    .email()
    .regex(/^\S+@\S+\.\S+$/)
    .required(),
});
const signup = Joi.object().keys({
  first_name: Joi.string().min(3).max(45).required(),
  last_name: Joi.string().min(3).max(45).required(),
  password: Joi.string().min(6).max(50).required(),
  phoneNumber: Joi.string()
    .regex(/[0-9]{10}$/)
    .required(),
  address: Joi.string().required(),
});
const invite = Joi.object().keys({
  url: Joi.string().required(),
  projectID: Joi.number().required(),
  email: Joi.string()
    .email()
    .regex(/^\S+@\S+\.\S+$/)
    .required(),
});
// error message function
const error = (err, res) => {
  const errMessage = err.details[0].message;
  return serverResponse(res, 422, ...["status", 422, "error", errMessage]);
};
// validations
const validSignup = (req, res, next) => {
  let { first_name, last_name, address, phoneNumber, password } = req.body;
  let { key } = req.params;
  if (!key || !first_name || !last_name || !address || !phoneNumber) {
    return serverResponse(
      res,
      422,
      ...["status", 422, "error", "All fields required"]
    );
  }
  const minMaxLength = /^[\s\S]{6,50}$/;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const phoneFormat = /[0-9]{10}$/;
  if (!phoneFormat.test(phoneNumber)) {
    return serverResponse(
      res,
      422,
      ...["status", 422, "error", "Phone number must be valid"]
    );
  }
  if (
    minMaxLength.test(password) &&
    (uppercaseRegex.test(password) || lowercaseRegex.test(password))
  ) {
    return Joi.validate(req.body, signup, (err, value) => {
      if (err) {
        return error(err, res);
      }
      return next();
    });
  }
  return serverResponse(
    res,
    422,
    ...["status", 422, "error", "password must be atleast 6 characters"]
  );
};
const validSignin = (req, res, next) => {
  let { email, password } = req.body;
  email = email.toLowerCase().trim();
  password = password.trim();
  if (!email || !password) {
    return serverResponse(
      res,
      422,
      ...["status", 422, "error", "All field required"]
    );
  }
  req.body.email = email;
  req.body.password = password;
  return Joi.validate(req.body, login, (err, value) => {
    if (err) {
      return error(err, res);
    }
    return next();
  });
};
const validProject = (req, res, next) => {
  return Joi.validate(req.body, project, (err, value) => {
    if (err) {
      return error(err, res);
    }
    return next();
  });
};
const validIssue = (req, res, next) => {
  return Joi.validate(req.body, issue, (err, value) => {
    if (err) {
      return error(err, res);
    }
    return next();
  });
};
const validInvite = (req, res, next) => {
  return Joi.validate(req.body, invite, (err, value) => {
    if (err) {
      return error(err, res);
    }
    return next();
  });
};
const validUpdate = (req, res, next) => {
  return Joi.validate(req.body, iUpdate, (err, value) => {
    if (err) {
      return error(err, res);
    }
    return next();
  });
};

export {
  validSignup,
  validSignin,
  validUpdate,
  validProject,
  validInvite,
  validIssue,
};
