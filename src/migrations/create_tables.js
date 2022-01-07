import { DB } from "../config/database";
import { Pool } from "pg";
const pool = new Pool({
  connectionString: DB,
});

const dropping = async () => {
  const userMigration = `DROP TABLE IF EXISTS users CASCADE`;
  const projectMigration = `DROP TABLE IF EXISTS projects CASCADE`;
  const issueMigration = `DROP TABLE IF EXISTS issues CASCADE`;
  try {
    await pool.query(userMigration);
    await pool.query(projectMigration);
    await pool.query(issueMigration);
    console.log("Tables dropped");
  } catch (err) {
    console.log(`${err}, Dropped failed`);
  }
};
const insertData = async () => {
  const adminInsert = `INSERT INTO users(first_name,last_name,email,address,password,phoneNumber,isAdmin) 
  VALUES('Charles','NDAYISABA','charles@tracker.rw','Kigali','$2a$08$jXozHrKh0B.DZJ9jvGO3IeMRwk9gT.5T2kfOEs0MGI6t4WrE3lDS6','0785856892','1')`;
  const projectInsert = `INSERT INTO projects(title,description,owner,people) 
  VALUES('Poker','Poker Game','1','{1,2,3}')`;

  try {
    await pool.query(adminInsert);
    await pool.query(projectInsert);
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
    address VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(10) NOT NULL,
    isAdmin INTEGER DEFAULT 3
  );`;
const projectsTable = `CREATE TABLE IF NOT EXISTS projects(
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(80) NOT NULL,
    description VARCHAR(80) NOT NULL,
    owner INTEGER REFERENCES users(id) NOT NULL,
    people INTEGER ARRAY
  );`;
const issuesTable = `CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(80) NOT NULL,
    description VARCHAR(80) NOT NULL,
    reporter INTEGER REFERENCES users(id) NOT NULL,
    project INTEGER REFERENCES projects(id) NOT NULL,
    screenshot VARCHAR(500) NOT NULL
  );`;
const createAllTables = async () => {
  try {
    await pool.query(usersTable);
    await pool.query(projectsTable);
    await pool.query(issuesTable);
    console.log("created");
  } catch (err) {
    console.log(`creation failed`);
  }
};

const trackerTables = async () => {
  await dropping();
  await createAllTables();
  await insertData();
  await process.exit(0);
};
trackerTables();
