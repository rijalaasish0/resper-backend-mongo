const Admin = require('../models/admin');
class Controllers {
    getLogout(req, res) {
        req.logout();
        res.json({"success":"logged out"});
    }

    async postRegister(req, res) {
        const searchedUser = await Admin.findOne({ username: req.body.username });
        if (searchedUser) {
            return res.json({ "error": "userExists" });
        }
        await Admin.register({ username: req.body.username, active: false }, req.body.password);
    }

    postLogin(req, res) {
        res.status(200).json({"success":req.user});
    }

    getFail (req, res){
        res.status(404).json({"fail":"couldn't do it"});
    }

    getHidden(req, res){
        res.send({"success":"`Hello ${req.user.username}`"});
    }
}

module.exports = new Controllers();