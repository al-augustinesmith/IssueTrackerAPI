import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { authResponse } from "./Response";
const hashedPassword = (password) => {
  return bcryptjs.hashSync(password, bcryptjs.genSaltSync(8));
};

const comparePassword = (hashPassword, password) => {
  return bcryptjs.compareSync(password, hashPassword);
};

const generateToken = (userObj) => jwt.sign(userObj, process.env.SECRET_KEY);
const generateKey = (keyObj) => jwt.sign(keyObj, process.env.SECRET_KEY);
const verifyKey = (key) => jwt.verify(key, process.env.SECRET_KEY);
const checkToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return authResponse(res, 403, ...["error", "Token must be provided"]);
    }
    const bearer = header.split(" ");
    const token = bearer[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return authResponse(
        res,
        403,
        ...["error", "Unable to authenticate token"]
      );
    }
    req.tokenData = decoded;
    return next();
  } catch (err) {
    return authResponse(res, 403, ...["error", "Authentication failed"]);
  }
};

export {
  hashedPassword,
  comparePassword,
  generateToken,
  generateKey,
  verifyKey,
  checkToken,
};
