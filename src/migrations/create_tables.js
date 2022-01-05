import { DB } from "../config/database";
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: DB
});

const dropping = async () => {
  const userMigration = `DROP TABLE IF EXISTS users CASCADE`;
  const categoryMigration = `DROP TABLE IF EXISTS category CASCADE`;
  try {
    await pool.query(userMigration);
    await pool.query(categoryMigration);
    console.log('Tables dropped');
  } catch (err) {
    console.log(`${err}, Dropped failed`);
  }
};
const insertData = async () => {
  const AdminInsert = `INSERT INTO users(first_name,last_name,email,address,password,phoneNumber,isAdmin) 
  VALUES('Charles','NDAYISABA','charles@tracker.rw','Kigali','$2a$08$jXozHrKh0B.DZJ9jvGO3IeMRwk9gT.5T2kfOEs0MGI6t4WrE3lDS6','0785856892','1')`;
 
  try {
    await pool.query(AdminInsert);
    await pool.query(categoryInsert);
    console.log('Data Inserted');
  } catch (err) {
    console.log(`${err}, Inserted failed`);
  }
}
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

const createAllTables = async () => {
  try {
    await pool.query(usersTable);
    console.log('created')
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

