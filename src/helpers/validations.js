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
  email: Joi.string()
    .email()
    .regex(/^\S+@\S+\.\S+$/)
    .required(),
});
const signup = Joi.object().keys({
  first_name: Joi.string().min(1).max(50).required(),
  last_name: Joi.string().min(1).max(50).required(),
  organisation:Joi.string(),
  representative: Joi.string(),
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
  let { first_name, last_name } = req.body;
  let { key } = req.params;
  if (!key || !first_name || !last_name) {
    return serverResponse(
      res,
      422,
      ...["status", 422, "error", "Please fill the required fields"]
    );
  }
  return Joi.validate(req.body, signup, (err, value) => {
    if (err) {
      return error(err, res);
    }
    return next();
  });
};
const validSignin = (req, res, next) => {
  let { email} = req.body;
  email = email.toLowerCase().trim();
  if (!email) {
    return serverResponse(
      res,
      422,
      ...["status", 422, "error", "Email required"]
    );
  }
  req.body.email = email;
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
