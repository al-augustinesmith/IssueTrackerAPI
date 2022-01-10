import {
  generateToken,
  comparePassword,
  hashedPassword,
} from "../helpers/auth";
import { sendEmail } from "../helpers/email";
import db from "../database";
import { serverError, serverResponse, userResponse } from "../helpers/Response";
export default class User {
  static signUp(req, res) {
    try {
      let {
        email,
        first_name,
        last_name,
        address,
        password,
        phoneNumber,
        isAdmin,
      } = req.body;
      password = hashedPassword(password);
      const table = "users";
      const columns = `first_name, last_name, email, password, phonenumber,address,isadmin`;
      const values = `'${first_name}', '${last_name}', '${email}', '${password}', '${phoneNumber}', '${address}','${isAdmin}'`;
      db.queryCreate(table, columns, values)
        .then((userRes) => {
          const { id, email, isadmin } = userRes;
          const token = generateToken({ id, email, isadmin });

          const SignedUp = {
            id,
            token,
            first_name,
            last_name,
            email,
            phoneNumber,
            address,
            isadmin,
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
            403,
            ...["status", 403, "error", `This Email Already exists.`]
          );
        });
    } catch (err) {
      return serverError(res);
    }
  }
  static InviteUser(req, res) {
    try {
      let { email, project } = req.body;
      const invite_key = generateToken({ email, project });
      const table = "userProjects";
      const columns = `project,invite_key,email,joined`;
      const values = `'${project}', '${invite_key}', '${email}',false`;
      db.queryCreate(table, columns, values)
        .then((invitedUser) => {
          const { id, email, project } = invitedUser;
          sendEmail(email, invite_key).catch(console.error);
          return userResponse(
            res,
            201,
            ...[
              "status",
              201,
              "message",
              "User Invited Successfully",
              "data",
              email,
            ]
          );
        })
        .catch((err) => {
          return serverResponse(
            res,
            403,
            ...["status", 403, "error", `This User already invited.`]
          );
        });
    } catch (err) {
      return serverError(res);
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
    const { email, password } = req.body;
    const checkPassword = password;
    const columns = `id, first_name, last_name,phonenumber, password,isadmin`;
    const values = `WHERE email='${email}'`;
    db.querySignin(columns, values)
      .then((response) => {
        if (!response.length) {
          return serverResponse(
            res,
            404,
            ...["status", 404, "error", "User not found"]
          );
        }

        const [{ id, first_name, last_name, password, isadmin }] = response;
        const decryptedPassword = comparePassword(password, checkPassword);
        if (!decryptedPassword) {
          return serverResponse(
            res,
            422,
            ...["status", 422, "error", "Incorrect Password"]
          );
        }
        const token = generateToken({ id, email, isadmin });

        const loggedIn = {
          id,
          token,
          first_name,
          last_name,
          email,
          isadmin,
        };

        return userResponse(
          res,
          200,
          ...["status", 200, "message", "Ok", "data", loggedIn]
        );
      })
      .catch((err) => {
        return serverError(res);
      });
  }
  //get current user
  static currentUser(req, res) {
    const { id } = req.tokenData;
    db.findCurrentUser(id)
      .then((response) => {
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
}
