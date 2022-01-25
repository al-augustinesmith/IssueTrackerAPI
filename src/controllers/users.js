import {
  generateToken,
  generateKey,
  verifyKey,
  comparePassword,
  hashedPassword,
  getPasscode
} from "../helpers/auth";
import { sendEmail,sendPasscode } from "../helpers/email";
import db from "../database";
import { serverError, serverResponse, userResponse } from "../helpers/Response";
export default class User {
  static signUp(req, res) {
    try {
      let { first_name, last_name, address, password, phoneNumber } = req.body;
      const { key } = req.params;
      let { email, project } = verifyKey(key);
      password = hashedPassword(password);
      const table = "users";
      const columns = `first_name, last_name, email, password, phonenumber,address`;
      const values = `'${first_name}', '${last_name}', '${email}', '${password}', '${phoneNumber}', '${address}'`;
      const condition= `WHERE email='${email}'`;
      db.acceptInvite(table, columns, values,condition)
        .then((userRes) => {
          const { id, first_name, last_name, email, isadmin,projects } = userRes;
          const token = generateToken({
            id,
            email,
            first_name,
            last_name,
            isadmin,
            projects
          });

          const SignedUp = {
            id,
            token,
            first_name,
            last_name,
            email,
            phoneNumber,
            address,
            isadmin,
            projects
          };
          return userResponse(
            res,
            201,
            ...[
              "status",
              201,
              "message",
              "user Created Successfully",
              "data",
              SignedUp,
            ]
          );
        })
        .catch((err) => {
          return serverResponse(
            res,
            202,
            ...["status", 202, "error", `This Email Already exists.`]
          );
        });
    } catch (err) {
      return serverError(res);
    }
  }
  static InviteUser(req, res) {
    try {
      const { email, projectID, url } = req.body;
      const { first_name, last_name } = req.tokenData;
      const invite_key = generateKey({ email, projectID });
      const table = "userProjects";
      const columns = `projectID,invite_key,email,joined`;
      const values = `'${projectID}', '${invite_key}', '${email}',false`;
      const condition = `WHERE email='${email}' AND projectID='${projectID}'`;
      db.dataCreate(res, table, columns, values, condition)
        .then((response) => {
          sendEmail({ first_name, last_name }, email, invite_key, url).catch(
            console.error
          );
          return response;
        })
        .catch((err) => {
          return serverError(res,err);
        });
    } catch (err) {
      return serverError(res,err);
    }
  }
  // update user info
  static UpdateUser(req, res) {
    try {
      const { id } = req.tokenData;
      let { first_name, last_name, address, phonenumber, password } = req.body;
      let values = `first_name='${first_name}',last_name='${last_name}',phonenumber='${phonenumber}',address='${address}'`;
      if (password) {
        password = hashedPassword(password);
        values = `first_name='${first_name}',last_name='${last_name}',password='${password}',phonenumber='${phonenumber}',address='${address}'`;
      }
      const table = "users";
      db.userUpdate(table, values, id)
        .then((userRes) => {
          return userResponse(
            res,
            200,
            ...[
              "status",
              200,
              "message",
              "user Updated Successfully",
              "data",
              userRes,
            ]
          );
        })
        .catch((err) => {
          return serverError(res);
        });
    } catch (err) {
      return serverError(res);
    }
  }
  // user signin
  static signIn(req, res) {
    const { email } = req.body;
    const columns = `*`;
    const values = `WHERE email='${email}'`;
    db.querySignin(columns, values)
      .then((response) => {
        if (!response) {
          return serverResponse(
            res,
            404,
            ...["status", 404, "error", "User not found"]
          );
        }
        const passcode=getPasscode(100000,999999)
        const token = generateToken(response);
        response.passcode=passcode
        sendPasscode(response)
        response.token=token
        return userResponse(
          res,
          200,
          ...["status", 200, "message", "Ok", "data", response]
        );
      })
      .catch((err) => {
        return serverError(res);
      });
  }
  //get invited user
  static invitedUser(req, res) {
    const { email, project } = req.tokenData;
    db.findInvitedUser(email)
      .then((response) => {
        if (!response) {
          return serverResponse(
            res,
            202,
            ...["status", 202, "email", email]
          );
        }
        const token = generateToken(response);
        response.token=token
        return userResponse(
          res,
          200,
          ...["status", 200, "message", "Ok", "data", response]
        );
      })
      .catch((err) => {
        return serverError(res, err);
      });
  }
  //get all users
  static allUsers(req, res) {
    const { isadmin} = req.tokenData;
    if(!isadmin){
      return serverResponse(
        res,
        401,
        ...["status",401 , "error", 'Only admin accounts']
      );
    }
    db.findAllUsers()
      .then((response) => {
        if (!response) {
          return serverResponse(
            res,
            202,
            ...["status", 202, "email", email]
          );
        }

        return userResponse(
          res,
          200,
          ...["status", 200, "message", "Ok", "data", response]
        );
      })
      .catch((err) => {
        return serverError(res, err);
      });
  }
}
