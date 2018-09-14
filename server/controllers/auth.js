let express = require('express');
let passport = require('passport');

let router = express.Router();
let GoogleStrategy = require('passport-google-oauth2').Strategy;
let User = require('../models/User');
let responseHandler = require('../util/responseHandler').Response;
let envConfig = require('../config/env');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: envConfig.googleAuth.clientID,
    clientSecret: envConfig.googleAuth.clientSecret,
    callbackURL: envConfig.siteUrl + envConfig.googleAuth.callbackUrl,
    passReqToCallback: true
  },
  (request, accessToken, refreshToken, profile, done) => {
    User.findOne({'email': profile.email}, (err, person) => {
      if (err) {
        return handleError(err);
      } else {
        if (person) {
          request.session.user = person;
          return done(err, person);
        } else {
          let user = new User({
            name: {
              familyName: profile.name.familyName,
              givenName: profile.name.givenName
            },
            isActive: true,
            email: profile.email,
            imageUrl: profile.photos[0].value,
            provider: profile.provier,
            providerData: profile._json
          });
          user.save((err, data) => {
            if(!err && data) {
              request.session.user = data;
            }
            return done(err, data);
          })
        }
      }
    });
  }
));

router.get('/google',
  passport.authenticate('google', {
      scope:
        [
          'https://www.googleapis.com/auth/plus.login',
          'https://www.googleapis.com/auth/plus.profile.emails.read'
        ]
    }
  ));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/'
}));

router.get('/getCurrentSession', (req, res, next) => {
  let sessionObj = {user: null};
  console.log(req.session)
  if (req.session && req.session.user) {
    sessionObj.user = {
      id: req.session.user._id,
      email: req.session.user.email,
      imageUrl: req.session.user.imageUrl,
      name: req.session.user.providerData,
      role: (req.session.user.isAdmin) ? 'admin':'user'
    }
  }
  res.locals.responseObj = sessionObj;
  next();
}, responseHandler);

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
});

router.get('/checkSession', (req, res, next) => {
  res.locals.responseObj = { session:  !!(req.session && req.session.user)} ;
  next();
}, responseHandler);

router.get('/myEvents', (req, res, next) => {
  if(req.session && req.session.user) {
    User.findById(req.session.user._id).select('compiler treasureHunt hackathon').exec((err, events) => {
      res.locals.responseObj = {
        err: err,
        data: events,
        msg: "users events"
      };
      next();
    });
  } else {
    res.locals.responseObj = {
      err: null,
      data: null,
      msg: "users events"
    };
    next()
  }
}, responseHandler);

module.exports = router;
