/* const router = require('express').Router();

router.post('/register', (req, res) => {
  res.send('Register');
});

module.exports = router; */
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

module.exports = function(app) {
  app.post('/register', async (req, res) => {
    //Validate before processing the user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    /*
     * Creates a new user
     */
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });
    try {
      const savedUser = await user.save();
      res.send({ user: user._id });
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

  //Login
  app.post('/login', async (req, res) => {
    //Validate before processing the user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the email exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email not found');
    //if password is correct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send('Invalid password');

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    //res.send('Logged In!');
  });
};

//TODO Remove/ Fix the refactoring of strategies

/* const router = require('express').Router();
const passport = require('passport');

const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;

const keys = require('../config/config');
const chalk = require('chalk');

let user = {};

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

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

router.get('/facebook', passport.authenticate('facebook'));
//TODO Worked with /auth/facebook/callback!!!
router.get(
  '/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    res.redirect('/profile');
  }
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

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/profile');
});

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

router.get('/instagram', passport.authenticate('instagram'));
router.get(
  '/instagram/callback',
  passport.authenticate('instagram'),
  (req, res) => {
    res.redirect('/profile');
  }
);

// Spotify Strategy
passport.use(
  new SpotifyStrategy(
    {
      clientID: keys.SPOTIFY.clientID,
      clientSecret: keys.SPOTIFY.clientSecret,
      callbackURL: '/spotify/callback'
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log(chalk.blue(JSON.stringify(profile)));
      user = { ...profile };
      return cb(null, profile);
    }
  )
);

router.get('/spotify', passport.authenticate('spotify'));

router.get(
  '/spotify/callback',
  passport.authenticate('spotify'),
  (req, res) => {
    res.redirect('/profile');
  }
);

module.exports = router;
 */
