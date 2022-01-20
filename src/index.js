import express from "express";
import passport from "passport";
import cors from "cors";
import bodyParser from "body-parser";
import Authentication from "./routes/auth";
import Tracker from "./routes/tracker";
const app = express();
const port = process.env.PORT || 8000;
//passport configuration
app.use(passport.initialize());
app.use(cors());
// Body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Add headers before the routes are defined

app.get("/", (req, res) => {
  return res.status(200).send({ message: "Issue tracker API" });
});
// Users
app.use("/api/v3/auth/", Authentication);

// Issues API
app.use("/api/v3/", Tracker);
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
