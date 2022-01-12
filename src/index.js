import express from 'express';
import passport from "passport";
import path from "path";
import bodyParser from 'body-parser'
import Authentication from './routes/auth';
import Tracker from './routes/tracker';
const app = express()
const port=process.env.PORT || 8000
//passport configuration
app.use(passport.initialize());

// Body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  return res.status(200).send({'message': 'Issue tracker API'});
})
// Users
app.use('/api/v3/auth/',Authentication);

// Kavata API
app.use('/api/v3/',Tracker);
app.listen(port,()=>{
  console.log(`app running on port ${port}`);
});
