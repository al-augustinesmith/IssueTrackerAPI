import "dotenv/config";
export const DB = (process.env.NODE_ENV === 'development') ? process.env.DB_DEV_URL : process.env.DB_URL;