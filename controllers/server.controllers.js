const Admin = require('../models/admin');
const jwt = require("jsonwebtoken");
const Time = require("../models/time");

class ServerControllers {
    async serverLogin(req, res) {
        try {
            const { username, password } = req.body;
            const reqRestaurantID = parseInt(req.params['restaurantID']);

            if (!(username && password && reqRestaurantID)) {
                return res.json({ "error": "all input required" });
            }

            const restaurantAdmin = await Admin.findOne({ restaurantID: reqRestaurantID });
            if (!restaurantAdmin) {
                return res.json({ "error": "invalid restaurant ID" });
            }

            const serverUser = restaurantAdmin.servers.find((server) => server.username === username);

            if (serverUser) {
                if (serverUser.password === password) {
                    const token = jwt.sign(
                        { user_id: serverUser._id, username: username, fullname: serverUser.fullname, hoursWorked: serverUser.hoursWorked},
                        "bhalubangbest",
                        {
                            expiresIn: "1h",
                        }
                    );
                    return res.json({ "success": serverUser, "token": token, "status": 200 });
                } else {
                    return res.json({ "error": "invalid password" });
                }
            }

        } catch (e) {
            res.json({ "error": "DB error" });
        }
    }

    async checkIn(req, res) {
        try {
            const reqRestaurantID = req.params['restaurantID'];
            const username = req.user.username;
            const date = new Date();
            const checkInTime = date.getUTCMinutes();

            const success = Time.checkInUser(reqRestaurantID, username, checkInTime);
            if(success === 0){
                res.json({"error":"Already checked in", status:404});
            }else{
                res.json({"success":checkInTime});
            }
        } catch (e) {
            console.log(e);
            res.json({ "error": e });
        }

    }

    async getServer(req, res){
        // const reqRestaurantID = parseInt(req.params['restaurantID']);
        // const username = req.user.username;
        // const restaurantAdmin = await Admin.findOne({ restaurantID: reqRestaurantID });
        // let serverUser = restaurantAdmin.servers.find((server) => server.username === username);
        // await delete serverUser.password;
        res.json({"success":req.user});
    }

    async checkOut(req, res) {
        const reqRestaurantID = req.params['restaurantID'];
        const username = req.user.username;
        const serverID = req.user.user_id;
        const date = new Date();
        const checkOutTime = date.getUTCMinutes();
        const success = Time.checkOutUser(reqRestaurantID, username, checkOutTime);
        if(success === 0){
            res.json({"error":"User not checked in or just checked in", status:404});
        }else{
            const todaysDate = Date().toString();

            console.log(reqRestaurantID, serverID);
            Admin.updateOne(
                { restaurantID: reqRestaurantID, "servers._id": serverID},
                { $push: { "servers.$.hoursWorked": {date: todaysDate, numHours: success}} },
                function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.json({ "error": "DB error" });
                    } else {
                        console.log(result);
                        return res.json({ "success": "Hours have been added", status: 200, hours: success});
                    }
                }
            )
        }
    }
}

module.exports = new ServerControllers();