import { DB } from "../config/database";
import { Pool } from "pg";
const pool = new Pool({
  connectionString: DB,
});

const dropping = async () => {
  const userMigration = `DROP TABLE IF EXISTS users CASCADE`;
  const uProMigration = `DROP TABLE IF EXISTS userProjects CASCADE`;
  const issueMigration = `DROP TABLE IF EXISTS issues CASCADE`;
  try {
    await pool.query(userMigration);
    await pool.query(uProMigration);
    await pool.query(issueMigration);
    console.log("Tables dropped");
  } catch (err) {
    console.log(`${err}, Dropped failed`);
  }
};
const insertData = async () => {
  // default admin pass is: admin12
  const adminInsert = `INSERT INTO users(first_name,last_name,email,organisation,representative,isAdmin) 
  VALUES('Charles','NDAYISABA','nccharles1@gmail.com','Issue Tracker','',true)`;

  try {
    await pool.query(adminInsert);
    console.log("Data Inserted");
  } catch (err) {
    console.log(`${err}, Inserted failed`);
  }
};
const usersTable = `CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(80) NOT NULL,
    last_name VARCHAR(80) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    organisation VARCHAR(255) NOT NULL,
    representative VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN DEFAULT false
  );`;

const uProTable = `CREATE TABLE IF NOT EXISTS userProjects(
    id SERIAL PRIMARY KEY NOT NULL,
    projectID VARCHAR(16) NOT NULL,
    invite_key text NOT NULL,
    email VARCHAR(200) NOT NULL,
    joined BOOLEAN DEFAULT false
  );`;
const issuesTable = `CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(80) NOT NULL,
    description VARCHAR(80) NOT NULL,
    reporter INTEGER REFERENCES users(id) NOT NULL,
    projectID VARCHAR(16) NOT NULL,
    screenshot text NOT NULL,
    idate text NOT NULL,
    sent BOOLEAN DEFAULT false
  );`;
const createAllTables = async () => {
  try {
    await pool.query(usersTable);
    await pool.query(uProTable);
    await pool.query(issuesTable);
    console.log("created");
  } catch (err) {
    console.log(`creation ${err.message}`);
  }
};

const trackerTables = async () => {
  await dropping();
  await createAllTables();
  await insertData();
  await process.exit(0);
};
trackerTables();
