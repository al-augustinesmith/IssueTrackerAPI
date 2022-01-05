import express from 'express';
import passport from "passport";
import path from "path";
import bodyParser from 'body-parser'
import Authentication from './routes/auth';
import Liquors from './routes/liquor';
import pages from './routes/pages';
const app = express()
const port=process.env.PORT || 8000
//passport configuration
app.use(passport.initialize());

// Body parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//load static pages html and css
app.use(express.static(path.join(__dirname, "../UI")));
//app pages
app.use("/", pages);
app.get('/api/v1', (req, res) => {
  return res.status(200).send({'message': 'Liquor API'});
})
// Users
app.use('/api/v1/auth/',Authentication);

// Kavata API
app.use('/api/v1/kavata/',Liquors);
app.listen(port,()=>{
  console.log(`app running on port ${port}`);
});
