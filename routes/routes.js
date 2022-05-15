let express = require('express');
let router = express.Router();
const connectEnsureLogin = require('connect-ensure-login'); //authorization
const {getLogout, postRegister, postLogin, getFail, getHidden, addServer, getServers, postFeedback, postRating, getRatings, getFeedbacks, deleteServer, deleteRating, deleteFeedback, changeTableNumber} = require('../controllers/admin.controllers')
const {serverLogin} = require('../controllers/server.controllers');
const {isAdmin, isServer} = require('../middlewares/auth');

const passport = require('passport');
// router.post('/admin/register', postAdminRegister);
// router.get('/admin/login', postAdminLogin);
// router.get('/admin', getAdminPage);


router.get('/hidden', connectEnsureLogin.ensureLoggedIn(), getHidden);

// router.get('/home', (req, res) => {
//     res.json({ "success": "idk" });
// })

router.get('/fail', getFail);

router.get('/admin/logout', connectEnsureLogin.ensureLoggedIn(), isAdmin, getLogout);

router.post('/admin/register', postRegister);

router.post('/:restaurantID/feedback', postFeedback);

router.post('/:restaurantID/rating', postRating);

router.post('/admin/login', passport.authenticate('local', { failureRedirect: '/fail' }), postLogin);

router.post('/admin/servers', connectEnsureLogin.ensureLoggedIn(), isAdmin, addServer);

router.get('/admin/servers', connectEnsureLogin.ensureLoggedIn(), isAdmin, getServers);

router.get('/admin/ratings',  connectEnsureLogin.ensureLoggedIn(), isAdmin, getRatings);

router.get('/admin/feedbacks', connectEnsureLogin.ensureLoggedIn(), isAdmin, getFeedbacks);

router.delete('/admin/servers', connectEnsureLogin.ensureLoggedIn(), isAdmin, deleteServer);

router.delete('/admin/ratings', connectEnsureLogin.ensureLoggedIn(), isAdmin, deleteRating);

router.delete('/admin/feedbacks', connectEnsureLogin.ensureLoggedIn(), isAdmin, deleteFeedback);

router.put('/admin/tables', connectEnsureLogin.ensureLoggedIn(), isAdmin, changeTableNumber);

router.post('/:restaurantID/servers/login', serverLogin);

router.post('/serverTest', isServer, function(req, res) {
    res.json({"success":req.user, "status":200});
});

module.exports = router;