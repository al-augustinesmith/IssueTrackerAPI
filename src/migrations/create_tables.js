import { DB } from "../config/database";
import { Pool } from 'pg';
const pool = new Pool({
  connectionString: DB
});

const dropping = async () => {
  const userMigration = `DROP TABLE IF EXISTS users CASCADE`;
  const liquorMigration = `DROP TABLE IF EXISTS liquor CASCADE`;
  const orderMigration = `DROP TABLE IF EXISTS client_order CASCADE`;
  const beerMigration = `DROP TABLE IF EXISTS beer CASCADE`;
  const categoryMigration = `DROP TABLE IF EXISTS category CASCADE`;
  try {
    await pool.query(userMigration);
    await pool.query(liquorMigration);
    await pool.query(orderMigration);
    await pool.query(beerMigration);
    await pool.query(categoryMigration);
    console.log('Tables dropped');
  } catch (err) {
    console.log(`${err}, Dropped failed`);
  }
};
const insertData = async () => {
  const AdminInsert = `INSERT INTO users(first_name,last_name,email,address,password,phoneNumber,isAdmin) 
  VALUES('Rodrigue','MUGISHA','rodrigue@kavata.rw','Kigali','$2a$08$jXozHrKh0B.DZJ9jvGO3IeMRwk9gT.5T2kfOEs0MGI6t4WrE3lDS6','0785856892','1')`;
  const beerInsert = `INSERT INTO beer(beer_name) VALUES('liquor'),('wine'),('mix')`;
  const categoryInsert = `INSERT INTO category(beer_type,category_name) 
  VALUES('1','Whisky'),('1','Cognac'),
  ('1','Vodka'),('1','Gin'),
  ('1','Rum'),('1','Cream and coffee'),
  ('1','Tequila'),('1','Aperif'),
  ('2','Red Wine'),('2','White Wine'),
  ('2','Rose Wine'),('2','Sparking Wine'),
  ('2','Sweet and Dessert Wine'),('3','Fanta'),
  ('3','Juice'),('3','Water'),('3','Other')`;
  try {
    await pool.query(AdminInsert);
    await pool.query(beerInsert);
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
const beerTable = `CREATE TABLE IF NOT EXISTS beer(
  id SERIAL PRIMARY KEY NOT NULL,
  beer_name VARCHAR(255) NOT NULL)`;
const beerCategories = `CREATE TABLE IF NOT EXISTS category(
  id SERIAL PRIMARY KEY NOT NULL,
  beer_type INTEGER REFERENCES beer(id),
  category_name VARCHAR(255) NOT NULL)`;
const liquorTable = `CREATE TABLE IF NOT EXISTS liquor(
    id SERIAL PRIMARY KEY NOT NULL,
    owner INTEGER REFERENCES users(id) NOT NULL,
    liquor_name VARCHAR(255) NOT NULL,
    category INTEGER REFERENCES category(id),
    about text NOT NULL,
    price VARCHAR(80) NOT NULL,
    created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    image_url text NOT NULL
  );`;
const orderTable = `CREATE TABLE IF NOT EXISTS client_order(
    id SERIAL PRIMARY KEY NOT NULL,
    o_owner INTEGER REFERENCES users(id) NOT NULL,
    liquor_ID INTEGER REFERENCES liquor(id) NOT NULL,
    liquor_no INTEGER DEFAULT 1,
    ordered_on VARCHAR(80) NOT NULL,
    derivered_on VARCHAR(80) NOT NULL,
    confirmed BOOLEAN DEFAULT false
  );`;
const createAllTables = async () => {
  try {
    await pool.query(usersTable);
    await pool.query(beerTable);
    await pool.query(beerCategories);
    await pool.query(liquorTable);
    await pool.query(orderTable);
    console.log('created')
  } catch (err) {
    console.log(`creation failed`);
  }
};

const liquorTables = async () => {
  await dropping();
  await createAllTables();
  await insertData();
  await process.exit(0);
};
liquorTables();

