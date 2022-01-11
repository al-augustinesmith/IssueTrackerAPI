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
      404,
      ...["status", 404, "error", `Data Already Inserted!`]
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
  const { rows } = await pool.query(queryString);
  return rows[0];
};

// get issue
const findIssue = async (columns, condition) => {
  const query = `SELECT ${columns} FROM issues AS I,users as u,projects as p ${condition};`;
  const { rows } = await pool.query(query);
  return rows;
};
// get curent user
const findCurrentUser = async (id) => {
  const query = `SELECT * FROM users WHERE id=${id};`;
  const { rows } = await pool.query(query);
  return rows;
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
  findCurrentUser,
  updateIssue,
  dataCreate,
  deleteIssue,
  queryCreate,
  querySignin,
};
