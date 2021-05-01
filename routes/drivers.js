var router          = require('express-promise-router')();
const passport      = require('passport');

const DriversController = require('../controllers/driver');

const passportJWT    = passport.authenticate('jwt',{session: false});

router.route('/createinfodriver')
  .post(passportJWT,DriversController.createInfoDriver);

module.exports = router;