let express = require('express');
let router = express.Router();
const connectEnsureLogin = require('connect-ensure-login'); //authorization
const {getLogout, postRegister, postLogin, getFail, getHidden} = require('../controllers/controllers')

const passport = require('passport');
// router.post('/admin/register', postAdminRegister);
// router.get('/admin/login', postAdminLogin);
// router.get('/admin', getAdminPage);


router.get('/hidden', connectEnsureLogin.ensureLoggedIn(), getHidden);

// router.get('/home', (req, res) => {
//     res.json({ "success": "idk" });
// })

router.get('/fail', getFail);

router.get('/logout', getLogout);

router.post('/register', postRegister)

router.post('/login', passport.authenticate('local', { failureRedirect: '/fail' }), postLogin);


module.exports = router;