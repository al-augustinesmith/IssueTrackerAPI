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
// add new liquor
const lCreate = async (res, table, columns, values, condition) => {
  const liquor = `SELECT id FROM liquor ${condition};`;
  if ((await pool.query(liquor)).rows[0]) {
    return serverResponse(
      res,
      404,
      ...["status", 404, "error", `This liquor Alread Inserted!`]
    );
  }

  const queryString = `INSERT INTO ${table} (${columns}) VALUES (${values}) RETURNING *;`;
  const { rows: Result } = await pool.query(queryString);
 
  return serverResponse(
    res,
    201,
    ...[
      "status",
      201,
      "message",
      "Liquor Successfully posted",
      "data",
      Result[0],
    ]
  );
};
// Singin
const querySignin = async (columns, condition) => {
  const queryString = `SELECT ${columns} FROM users ${condition};`;
  const { rows } = await pool.query(queryString);
  return rows;
};

// get liquor

const findLiquor = async (columns, condition) => {
  const query = `SELECT ${columns} FROM liquor AS l,users as u,beer AS b,category AS c ${condition};`;
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
const deleteLiquor = async (res, userId, isAdmin, lId) => {
  let queryString = `DELETE FROM liquor WHERE owner = ${userId} AND id =${lId};`;
  let liquorOwner = `SELECT owner FROM liquor WHERE owner = ${userId} AND id =${lId} ;`;
  const liquor = `SELECT id FROM liquor WHERE id =${lId} ;`;
  if (!(await pool.query(liquor)).rows[0]) {
    return serverResponse(
      res,
      404,
      ...["status", 404, "error", `This liquor not fund!`]
    );
  }

  if (isAdmin) {
    liquorOwner = `SELECT owner FROM liquor WHERE id =${lId} ;`;
    queryString = `DELETE FROM liquor WHERE id =${lId};`;
  }
  if (!(await pool.query(liquorOwner)).rows[0])
    return serverResponse(
      res,
      401,
      ...["status", 401, "error", `Unauthorized: This liquor is not yours`]
    );

  await pool.query(queryString);
  return serverResponse(
    res,
    200,
    ...["status", 200, "message", "Deleted Successfully!"]
  );
};
// Update location
const updateLiquor = async (res, columns, userId, isAdmin, lId) => {
  const liquor = `SELECT id FROM liquor WHERE id =${lId} ;`;
  if (!(await pool.query(liquor)).rows[0]) {
    return serverResponse(
      res,
      404,
      ...["status", 404, "error", `This liquor not fund!`]
    );
  }

  const liquorOwner = `SELECT owner FROM liquor WHERE  id =${lId} ;`;
  if (isAdmin !== 1) {
    liquorOwner = `SELECT owner FROM liquor WHERE owner = ${userId} AND id =${lId} ;`;
  }
  if (!(await pool.query(liquorOwner)).rows[0])
    return serverResponse(
      res,
      401,
      ...["status", 401, "error", `Unauthorized: This liquor is not yours`]
    );

  const query = `UPDATE liquor SET ${columns} WHERE owner = ${userId} AND id =${lId} RETURNING *;`;
  const { rows } = await pool.query(query);
  return serverResponse(
    res,
    200,
    ...["status", 200, "message", "Updated Successfully", "data", rows[0]]
  );
};
// client_order
const client_order = async (
  res,
  columns,
  userId,
  lId,
  liquor_no,
  odate,
  ddate
) => {
  const liquor = `SELECT id FROM liquor WHERE id =${lId} ;`;
  if (!(await pool.query(liquor)).rows[0]) {
    return serverResponse(
      res,
      404,
      ...["status", 404, "error", `This liquor not fund!`]
    );
  }

  const checkUser = `SELECT id FROM users WHERE id = ${userId};`;
  if (!(await pool.query(checkUser)).rows[0])
    return serverResponse(
      res,
      404,
      ...["status", 404, "error", `User not fund`]
    );

  const checOrder = `SELECT o.id FROM client_order as o, users as u,liquor as l WHERE o.o_owner=u.id AND o.liquor_ID=l.id AND u.id=${userId} AND l.id=${lId}`;
  if ((await pool.query(checOrder)).rows[0])
    return serverResponse(
      res,
      403,
      ...["status", 403, "error", `Already ordered`]
    );
  const queryString = `INSERT INTO client_order(${columns}) VALUES (${userId},${lId},${liquor_no},'${odate}','${ddate}');`;
  await pool.query(queryString);
  const getdata = `SELECT o.id,u.first_name,u.last_name,u.email,u.address,u.phonenumber,l.liquor_name,l.category,o.ordered_on,l.image_url FROM client_order as o, users as u,liquor as l WHERE o.o_owner=u.id AND o.liquor_ID=l.id AND u.id=${userId} AND l.id=${lId}`;
  const { rows } = await pool.query(getdata);
  return serverResponse(
    res,
    200,
    ...["status", 200, "message", "Ok", "data", rows[0]]
  );
};
// confirm client_order
const confirm = async (res, id) => {
  const query = `UPDATE client_order SET confirmed='true' WHERE id = ${id} RETURNING *;`;
  const { rows } = await pool.query(query);
  return serverResponse(
    res,
    200,
    ...["status", 200, "message", "Confirmed Successfully", "data", rows[0]]
  );
};
// get ordered liquors
const getOrdered = async (res, condition) => {
  const getdata = `SELECT o.id,o.confirmed,u.first_name,u.last_name,u.email,u.address,u.phonenumber,l.liquor_name,l.category,o.ordered_on,o.derivered_on,l.image_url FROM client_order as o, users as u,liquor as l ${condition}`;
  const { rows } = await pool.query(getdata);
  return serverResponse(
    res,
    200,
    ...["status", 200, "message", "Ok", "data", rows]
  );
};

export default {
  query,
  confirm,
  userUpdate,
  findLiquor,
  client_order,
  findCurrentUser,
  getOrdered,
  updateLiquor,
  lCreate,
  deleteLiquor,
  queryCreate,
  querySignin,
};
