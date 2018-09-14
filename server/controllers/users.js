let express = require('express');
let router = express.Router();
let responseHandler = require('../util/responseHandler').Response;
let User = require('../models/User');

router.get('/getMyProfile', (req, res, next) => {
  User.findById(req.session.user._id).exec(function (err, user) {
    let responseObj
    if (!err) {
      responseObj = {
        name: user.providerData.displayName,
        email: user.email,
        points: user.totalPoints,
        gender: user.providerData.gender,
        image: user.imageUrl
      }
    }
    res.locals.responseObj = {
      err: err,
      data: responseObj,
      msg: "users profile"
    };
    next();
  })
}, responseHandler);

router.get('/dummy', (req, res) => {
  res.json({
    "name": "devesh"
  })
});
module.exports = router;