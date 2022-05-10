const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const Admin = require('./models/admin');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();
app.use(cors())
app.use(session({
    secret: 'bhalugangbhalugang',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 12 * 60 * 60 * 1000 }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

passport.use(Admin.createStrategy());

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

const port = 5000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));