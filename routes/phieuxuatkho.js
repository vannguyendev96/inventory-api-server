var router = require('express-promise-router')();
const passport = require('passport');

const PhieuXuatKhoController = require('../controllers/phieuxuatkho');

const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/create-pxk')
    .post(passportJWT, PhieuXuatKhoController.createPNK);

router.route('/getbyuser-pxk')
    .post(passportJWT, PhieuXuatKhoController.getListPXK);

router.route('/getbymalohang-pxkdetail')
    .post(passportJWT, PhieuXuatKhoController.getPNKChiTiet);

router.route('/search-pxk')
    .post(passportJWT, PhieuXuatKhoController.searchPNK);

module.exports = router;