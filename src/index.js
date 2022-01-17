import express from "express";
import passport from "passport";
import path from "path";
import bodyParser from "body-parser";
import Authentication from "./routes/auth";
import Tracker from "./routes/tracker";
const app = express();
const port = process.env.PORT || 8000;
//passport configuration
app.use(passport.initialize());

// Body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", false);

  // Pass to next layer of middleware
  next();
});
app.get("/", (req, res) => {
  return res.status(200).send({ message: "Issue tracker API" });
});
// Users
app.use("/api/v3/auth/", Authentication);

// Kavata API
app.use("/api/v3/", Tracker);
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
