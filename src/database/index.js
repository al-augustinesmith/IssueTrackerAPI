import "dotenv/config";
import { Pool } from "pg";
import { DB } from "../config/database";
import { serverResponse } from "../helpers/Response";

// database connection
const pool = new Pool({
  connectionString: DB,
});

// create query
const query = (text, params, isArr = false) => {
  return new Promise(async (resolve, reject) => {
    pool
      .query(text, params)
      .then(async (response) => {
        const { rows } = response;
        isArr ? resolve(rows) : resolve(rows[0]);
        pool.end();
      })
      .catch(async (err) => {
        reject(err);
        pool.end();
      });
  });
};

// insert into table
const queryCreate = async (table, columns, values) => {
  const queryString = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *;`;
  const { rows: Result } = await pool.query(queryString);
  return Result[0];
};

// insert into invitation table
const acceptInvite = async (table, columns, values,condition) => {
  const queryString = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *;`;
  const { rows: Result } = await pool.query(queryString);
  let user =Result[0];
  const projectString = `SELECT projectid FROM userProjects ${condition};`;
  let data= (await pool.query(projectString)).rows[0];
  user.projects=[];
  if(data && user){
    user.projects=data
    return user;
  }
  return user;
};

// update User
const userUpdate = async (table, values, userID) => {
  const queryString = `UPDATE ${table} SET ${values} WHERE id=${userID} RETURNING *;`;
  const { rows: Result } = await pool.query(queryString);
  return Result[0];
};
// add new data
const dataCreate = async (res, table, columns, values, condition) => {
  const issue = `SELECT id FROM ${table} ${condition};`;
  if ((await pool.query(issue)).rows[0]) {
    return serverResponse(
      res,
      202,
      ...["status", 202, "error", `Data Already Inserted!`]
    );
  }

  const queryString = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *;`;

  const { rows } = await pool.query(queryString);
  return serverResponse(
    res,
    201,
    ...["status", 201, "message", "Successfully added", "data", rows[0]]
  );
};
// Singin
const querySignin = async (columns, condition) => {
  const queryString = `SELECT ${columns} FROM users ${condition};`;
  let user = (await pool.query(queryString)).rows[0];
  const projectString = `SELECT projectid FROM userProjects ${condition};`;
  let {rows:Result}= await pool.query(projectString);
  if(user){
    user.projects=[];
  }
  if(Result && user){
    user.projects=Result
    return user;
  }
  return user;
};

// get issue
const findIssue = async (columns, condition) => {
  const query = `SELECT ${columns} FROM issues AS I,users as u ${condition};`;
  const { rows } = await pool.query(query);
  return rows;
};
// get projects
const findProject = async (columns, condition) => {
  const query = `SELECT ${columns} FROM projects AS p,users as u ${condition};`;
  const { rows } = await pool.query(query);
  return rows;
};
// get invited user
const findInvitedUser = async (email) => {
  const query = `SELECT * FROM users WHERE email='${email}';`;
  let user = (await pool.query(query)).rows[0];
  if(user){
  const projectString = `SELECT projectid FROM userProjects WHERE email='${email}';`;
  let {rows:Result}= await pool.query(projectString);
  user.projects=[];
  if(Result && user){
    user.projects=Result
    return user;
  }
}
  return user;
};
// get all users
const findAllUsers = async () => {
  const query = `SELECT * FROM users;`;
  let {rows:Result} = await pool.query(query);

  return Result;
};

// delete an Issue
const deleteIssue = async (res, userId, isAdmin, IId) => {
  let queryString = `DELETE FROM issues WHERE reporter = ${userId} AND id =${IId};`;
  let issueReporter = `SELECT reporter FROM issue WHERE reporter = ${userId} AND id =${IId} ;`;
  const issue = `SELECT id FROM issues WHERE id =${IId} ;`;
  if (!(await pool.query(issue)).rows[0]) {
    return serverResponse(
      res,
      404,
      ...["status", 404, "error", `This issue not fund!`]
    );
  }

  if (isAdmin) {
    issueReporter = `SELECT reporter FROM issues WHERE id =${IId} ;`;
    queryString = `DELETE FROM issues WHERE id =${IId};`;
  }
  if (!(await pool.query(issueReporter)).rows[0])
    return serverResponse(
      res,
      401,
      ...["status", 401, "error", `Unauthorized: This issue is not yours`]
    );

  await pool.query(queryString);
  return serverResponse(
    res,
    200,
    ...["status", 200, "message", "Deleted Successfully!"]
  );
};
// Update an Issue
const updateIssue = async (res, columns, userId, isAdmin, IId) => {
  const issue = `SELECT id FROM issues WHERE id =${IId} ;`;
  if (!(await pool.query(issue)).rows[0]) {
    return serverResponse(
      res,
      404,
      ...["status", 404, "error", `This issue not fund!`]
    );
  }

  const issueReporter = `SELECT reporter FROM issues WHERE  id =${IId} ;`;
  if (isAdmin !== 1) {
    issueReporter = `SELECT reporter FROM issues WHERE reporter = ${userId} AND id =${IId} ;`;
  }
  if (!(await pool.query(issueReporter)).rows[0])
    return serverResponse(
      res,
      401,
      ...["status", 401, "error", `Unauthorized: This issue is not yours`]
    );

  const query = `UPDATE issues SET ${columns} WHERE reporter = ${userId} AND id =${IId} RETURNING *;`;
  const { rows } = await pool.query(query);
  return serverResponse(
    res,
    200,
    ...["status", 200, "message", "Updated Successfully", "data", rows[0]]
  );
};

export default {
  query,
  userUpdate,
  findIssue,
  findProject,
  findInvitedUser,
  updateIssue,
  dataCreate,
  deleteIssue,
  findAllUsers,
  acceptInvite,
  queryCreate,
  querySignin,
};
