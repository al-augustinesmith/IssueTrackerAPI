import { DB } from "../config/database";
import { Pool } from "pg";
const pool = new Pool({
  connectionString: DB,
});

const dropping = async () => {
  const userMigration = `DROP TABLE IF EXISTS users CASCADE`;
  const projectMigration = `DROP TABLE IF EXISTS projects CASCADE`;
  const uProMigration = `DROP TABLE IF EXISTS userProjects CASCADE`;
  const issueMigration = `DROP TABLE IF EXISTS issues CASCADE`;
  try {
    await pool.query(userMigration);
    await pool.query(projectMigration);
    await pool.query(uProMigration);
    await pool.query(issueMigration);
    console.log("Tables dropped");
  } catch (err) {
    console.log(`${err}, Dropped failed`);
  }
};
const insertData = async () => {
  // default admin pass is: admin12
  const adminInsert = `INSERT INTO users(first_name,last_name,email,address,password,phoneNumber,isAdmin) 
  VALUES('Charles','NDAYISABA','admin@tracker.rw','Kigali','$2a$08$Pc0B3oN5Q8uM.jGrAvQdIuDlP58avOycdzVdNEYREc5CiQChc9fjG','0785856892',true)`;
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
    isAdmin BOOLEAN DEFAULT false
  );`;
const projectsTable = `CREATE TABLE IF NOT EXISTS projects(
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(80) NOT NULL,
    description VARCHAR(80) NOT NULL,
    owner INTEGER REFERENCES users(id) NOT NULL,
    people INTEGER ARRAY
  );`;
const uProTable = `CREATE TABLE IF NOT EXISTS userProjects(
    id SERIAL PRIMARY KEY NOT NULL,
    project INTEGER REFERENCES projects(id) NOT NULL,
    invite_key text NOT NULL,
    email VARCHAR(200) NOT NULL,
    joined BOOLEAN DEFAULT false
  );`;
const issuesTable = `CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(80) NOT NULL,
    description VARCHAR(80) NOT NULL,
    reporter INTEGER REFERENCES users(id) NOT NULL,
    project INTEGER REFERENCES projects(id) NOT NULL,
    screenshot text NOT NULL
  );`;
const createAllTables = async () => {
  try {
    await pool.query(usersTable);
    await pool.query(projectsTable);
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
