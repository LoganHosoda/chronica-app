const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const MongoStore = require('connect-mongo');
const app = express();

// Load config 
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport)

connectDB();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override
app.use(methodOverride((req, res) => {
  if(req.body && typeof req.body === 'object' & '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}))

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static Folders
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');

// Handlebars
app.engine('.hbs', exphbs.engine({ 
  helpers: {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
  },
  defaultLayout: 'main', 
  extname: '.hbs' 
}));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
  secret: 'coffee keyboard',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variabe 
app.use((req, res, next) => {
  res.locals.user = req.user || null 
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/auth', require('./routes/auth.js'));
app.use('/chronicles', require('./routes/chronicles'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
