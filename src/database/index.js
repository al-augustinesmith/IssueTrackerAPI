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
// add new issue
const iCreate = async (res, table, columns, values, condition) => {
  const issue = `SELECT id FROM ${table} ${condition};`;
  if ((await pool.query(issue)).rows[0]) {
    return serverResponse(
      res,
      404,
      ...["status", 404, "error", `This issue Alread Inserted!`]
    );
  }

  const queryString = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *;`;

  const { rows } = await pool.query(queryString);
  return serverResponse(
    res,
    201,
    ...["status", 201, "message", "issue Successfully posted", "data", rows[0]]
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
  const query = `SELECT ${columns} FROM issue AS I,users as u ${condition};`;
  const { rows } = await pool.query(query);
  return rows;
};
// get curent user
const findCurrentUser = async (id) => {
  const query = `SELECT * FROM users WHERE id=${id};`;
  const { rows } = await pool.query(query);
  return rows;
};

// delete location
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
// Update location
const updateIssue = async (res, columns, userId, isAdmin, IId) => {
  const issue = `SELECT id FROM issue WHERE id =${IId} ;`;
  if (!(await pool.query(issue)).rows[0]) {
    return serverResponse(
      res,
      404,
      ...["status", 404, "error", `This issue not fund!`]
    );
  }

  const issueReporter = `SELECT owner FROM issue WHERE  id =${IId} ;`;
  if (isAdmin !== 1) {
    issueReporter = `SELECT owner FROM issue WHERE owner = ${userId} AND id =${IId} ;`;
  }
  if (!(await pool.query(issueReporter)).rows[0])
    return serverResponse(
      res,
      401,
      ...["status", 401, "error", `Unauthorized: This issue is not yours`]
    );

  const query = `UPDATE issue SET ${columns} WHERE owner = ${userId} AND id =${IId} RETURNING *;`;
  const { rows } = await pool.query(query);
  return serverResponse(
    res,
    200,
    ...["status", 200, "message", "Updated Successfully", "data", rows[0]]
  );
};


  const checkUser = `SELECT id FROM users WHERE id = ${userId};`;
  if (!(await pool.query(checkUser)).rows[0])
    return serverResponse(
      res,
      404,
      ...["status", 404, "error", `User not fund`]
    );

  const queryString = `INSERT INTO client_order(${columns}) VALUES (${userId},${IId},${issue_no},'${odate}','${ddate}');`;
  await pool.query(queryString);
  const getdata = `SELECT o.id,u.first_name,u.last_name,u.email,u.address,u.phonenumber,l.issue_name,l.category,o.ordered_on,l.image_url FROM client_order as o, users as u,issue as l WHERE o.o_owner=u.id AND o.issue_ID=l.id AND u.id=${userId} AND l.id=${IId}`;
  const { rows } = await pool.query(getdata);
  return serverResponse(
    res,
    200,
    ...["status", 200, "message", "Ok", "data", rows[0]]
  );
};

export default {
  query,
  userUpdate,
  findIssue,
  findCurrentUser,
  updateIssue,
  iCreate,
  deleteIssue,
  queryCreate,
  querySignin,
};
