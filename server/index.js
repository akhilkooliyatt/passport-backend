const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const keys = require('./config/config');
const chalk = require('chalk');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

//connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connected to db')
);
let user = {};

//TODO Why needed?
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

//TODO Run concurrently and nodemon from server?!

//TODO Modularization of logic. Move all authentication logic to auth.js
// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: keys.FACEBOOK.clientID,
      clientSecret: keys.FACEBOOK.clientSecret,
      callbackURL: '/auth/facebook/callback'
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.blue(JSON.stringify(profile)));
      user = { ...profile };
      return cb(null, profile);
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.GOOGLE.clientID,
      clientSecret: keys.GOOGLE.clientSecret,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.blue(JSON.stringify(profile)));
      user = { ...profile };
      return cb(null, profile);
    }
  )
);

// Instagram Strategy
passport.use(
  new InstagramStrategy(
    {
      clientID: keys.INSTAGRAM.clientID,
      clientSecret: keys.INSTAGRAM.clientSecret,
      callbackURL: '/auth/instagram/callback'
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.blue(JSON.stringify(profile)));
      user = { ...profile };
      return cb(null, profile);
    }
  )
);

// Spotify Strategy
passport.use(
  new SpotifyStrategy(
    {
      clientID: keys.SPOTIFY.clientID,
      clientSecret: keys.SPOTIFY.clientSecret,
      callbackURL: '/auth/spotify/callback'
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.blue(JSON.stringify(profile)));
      user = { ...profile };
      return cb(null, profile);
    }
  )
);

const app = express();
app.use(cors());
app.options('*', cors());
app.use(passport.initialize());

/* //Import Routes
const authRoute = require('./routes/auth');
//Router Middlewares
app.use('api/user', authRoute);
 */

//All configurations should be made before route.
//Middleware
app.use(express.json());
const auth = require('./routes/auth')(app);
const userData = require('./routes/userData')(app);

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);
app.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/auth/instagram', passport.authenticate('instagram'));
app.get(
  '/auth/instagram/callback',
  passport.authenticate('instagram'),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/auth/spotify', passport.authenticate('spotify'));
app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify'),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/user', (req, res) => {
  console.log('getting user data!');
  res.send(user);
});

app.get('/auth/logout', (req, res) => {
  console.log('logging out!');
  user = {};
  res.redirect('/');
});

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
//TODO Remove/Fix the environment handling
/* if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

if (process.env.NODE_ENV === 'production') {
  console.log('Server in PRODUCTION!!!!');
  const privateKey = fs.readFileSync(
    '/etc/letsencrypt/live/learnpassportjs.com/privkey.pem',
    'utf8'
  );
  const certificate = fs.readFileSync(
    '/etc/letsencrypt/live/learnpassportjs.com/cert.pem',
    'utf8'
  );
  const ca = fs.readFileSync(
    '/etc/letsencrypt/live/learnpassportjs.com/chain.pem',
    'utf8'
  );
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  https.createServer(credentials, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
  http
    .createServer(function(req, res) {
      res.writeHead(301, {
        Location: 'https://' + req.headers['host'] + req.url
      });
      res.end();
    })
    .listen(80);
} else if (process.env.NODE_ENV === 'development') {
  const port = 5000;
  app.listen(port, () => console.log('Server started on port ${port}'));
} */
