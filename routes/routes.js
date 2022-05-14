let express = require('express');
let router = express.Router();
const connectEnsureLogin = require('connect-ensure-login'); //authorization
const {getLogout, postRegister, postLogin, getFail, getHidden, addServer, getServers, postFeedback, postRating, getRatings, getFeedbacks} = require('../controllers/admin.controllers')

const passport = require('passport');
// router.post('/admin/register', postAdminRegister);
// router.get('/admin/login', postAdminLogin);
// router.get('/admin', getAdminPage);


router.get('/hidden', connectEnsureLogin.ensureLoggedIn(), getHidden);

// router.get('/home', (req, res) => {
//     res.json({ "success": "idk" });
// })

router.get('/fail', getFail);

router.get('/admin/logout', getLogout);

router.post('/admin/register', postRegister);

router.post('/:restaurantID/feedback', postFeedback);

router.post('/:restaurantID/rating', postRating);

router.post('/admin/login', passport.authenticate('local', { failureRedirect: '/fail' }), postLogin);

router.post('/admin/servers', connectEnsureLogin.ensureLoggedIn(), addServer);

router.get('/admin/servers', connectEnsureLogin.ensureLoggedIn(), getServers);

router.get('/admin/ratings',  connectEnsureLogin.ensureLoggedIn(), getRatings);

router.get('/admin/feedbacks', getFeedbacks);


module.exports = router;