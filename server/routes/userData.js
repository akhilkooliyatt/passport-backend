const verify = require('./verifyToken');
const User = require('../model/User');

module.exports = function(app) {
  app.get('/userData', verify, async (req, res) => {
    const userDetail = await User.findOne({ _id: req.user._id });
    res.send(userDetail);
  });
};
