const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session')
const cors = require('cors')
const db = require('./models').db
const SequelizeStore = require('connect-session-sequelize')(session.Store)
if (process.env.NODE_ENV !== 'production') require('../secrets')
const sessionStore = new SequelizeStore({db})
const passport = require('passport')
const PORT = process.env.PORT || 3000
const app = express();

module.exports = app


passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) => {
  db.models.user.findById(id)
  .then((user) => {
    return done(null, user)
  })
  .catch(done)
})

const createApp = () => {
  app.use(cors({
    credentials: true
  }))
  // logging and body-parsing
  app.use(volleyball);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(session({
    secret: process.env.SESSION_SECRET || 'nyc',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  // serve dynamic routes
  app.use('/api', require('./routes'));

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // failed to catch req above means 404, forward to error handler
  app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // handle any errors
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).send(err.message);
  });
}

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))
}


const syncDb = () => db.sync({})

// listen on a port

if (require.main === module) {
	sessionStore.sync()
		.then(syncDb)
		.then(createApp)
		.then(startListening)
} else {
	createApp()
}

