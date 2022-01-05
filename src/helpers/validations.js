import Joi from '@hapi/joi'
import { serverResponse } from './Response';
// schema
const issue = Joi.object().keys({
    issue_name: Joi.string().required(),
    about: Joi.string().required(),
    category: Joi.string().required(),
    image_url: Joi.string().required()
});
const lUpdate = Joi.object().keys({
    issue_name: Joi.string(),
    about: Joi.string(),
    category: Joi.string(),
    image_url: Joi.string()
});
const login = Joi.object().keys({
    password: Joi.required(),
    email: Joi.string().email().regex(/^\S+@\S+\.\S+$/).required()
});
const signup = Joi.object().keys({
    first_name: Joi.string().min(3).max(45).required(),
    last_name: Joi.string().min(3).max(45).required(),
    password: Joi.string().min(6).max(50).required(),
    email: Joi.string().email().regex(/^\S+@\S+\.\S+$/).required(),
    phoneNumber: Joi.string().regex(/[0-9]{10}$/).required(),
    address: Joi.string().required(),
    isAdmin: Joi.number().required()
});
// error message function
const error = (err, res) => {
    const errMessage = err.details[0].message;
    return serverResponse(res, 422, ...['status', 422, 'error', errMessage]);
};
// validations
const validSignup = (req, res, next) => {
    const { first_name, last_name, address, phoneNumber, password } = req.body;
    let { email } = req.body;
    email = email.toLowerCase().trim();
    req.body.email = email;
    if (!email || !first_name || !last_name || !address || !phoneNumber) {
        return serverResponse(res, 422, ...['status', 422, 'error', 'All fields required']);
    }
    const minMaxLength = /^[\s\S]{6,50}$/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const phoneFormat = /[0-9]{10}$/;
    if (!phoneFormat.test(phoneNumber)) {
        return serverResponse(res, 422, ...['status', 422, 'error', 'Phone number must be valid']);
    }
    if (minMaxLength.test(password) && (uppercaseRegex.test(password) || lowercaseRegex.test(password))) {
        return Joi.validate(req.body, signup, (err, value) => {
            if (err) {
                return error(err, res);
            }
            return next();
        });
    }
    return serverResponse(res, 422, ...['status', 422, 'error', 'password must be atleast 6 characters']);
}
const validSignin = (req, res, next) => {
    let { email, password } = req.body;
    email = email.toLowerCase().trim();
    password = password.trim();
    if (!email || !password) {
        return serverResponse(res, 422, ...['status', 422, 'error', 'All field required']);
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
const validIssue = (req, res, next) => {
    return Joi.validate(req.body, issue, (err, value) => {
        if (err) {
            return error(err, res);
        }
        return next();
    });
};
const validUpdate = (req, res, next) => {
    return Joi.validate(req.body, lUpdate, (err, value) => {
        if (err) {
            return error(err, res);
        }
        return next();
    });
};

export { validSignup, validSignin, validUpdate, validIssue }