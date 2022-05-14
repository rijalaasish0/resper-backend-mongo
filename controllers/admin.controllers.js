const Admin = require('../models/admin');
class Controllers {
    getLogout(req, res) {
        req.logout();
        res.json({ "success": "logged out", status: 200 });
    }

    async postRegister(req, res) {
        const searchedUser = await Admin.findOne({ username: req.body.username });
        if (searchedUser) {
            return res.json({ "error": "userExists" });
        }
        try {
            const generatedRestaurantID = parseInt(Math.random() * 1000000);
            await Admin.register({ username: req.body.username, restaurantID: generatedRestaurantID, restaurantName: req.body.restaurantName, feedbacks: req.body.feedbacks, ratings: req.body.ratings, servers: req.body.servers, active: false }, req.body.password);
            res.json({ "success": generatedRestaurantID, status: 200 });
        } catch (e) {
            return res.json({ "error": "Bad request" });
        }
    }

    postLogin(req, res) {
        console.log(req.sessionID);
        res.json({ "success": req.user, status: 200 });
    }

    getFail(req, res) {
        res.json({ "fail": "couldn't do it" });
    }

    getHidden(req, res) {
        res.send({ "success": "`Hello ${req.user.username}`", status: 200 });
    }

    async getServers(req, res) {
        try {
            const searchedUser = await Admin.findOne({ username: req.user.username });
            return res.json({ "success": searchedUser.servers, status: 200 })
        } catch (e) {
            console.log(e);
            return res.json({ "error": "DB error" });
        }
    }

    async getFeedbacks(req, res) {
        try {
            const searchedUser = await Admin.findOne({ username: req.user.username });
            return res.json({ "success": searchedUser.feedbacks, status: 200 })
        } catch (e) {
            console.log(e);
            return res.json({ "error": "DB error" });
        }
    }

    async getRatings(req, res) {
        try {
            const searchedUser = await Admin.findOne({ username: req.user.username });
            return res.json({ "success": searchedUser.ratings, status: 200 })
        } catch (e) {
            console.log(e);
            return res.json({ "error": "DB error" });
        }
    }

    async deleteRating(req, res) {
        let ratingToDeleteID = req.body.id;
        try {
            Admin.updateOne(
                { username: req.user.username },
                { $pull: { ratings: { _id: ratingToDeleteID } } },
                function (err, result) {
                    if (err) {
                        console.log(err);

                        return res.json({ "error": "Couldn't delete the rating" });
                    } else {
                        if (result.modifiedCount === 0) {
                            return res.json({ "error": "Rating with that ID doesn't exist", status: 200 });
                        } else {
                            return res.json({ "success": "Rating has been deleted", status: 200 });

                        }
                    }
                }
            );
        } catch (e) {
            res.json({ "success": "false" });
        }
    }


    async deleteFeedback(req, res) {
        let feedbackToDeleteID = req.body.id;
        try {
            Admin.updateOne(
                { username: req.user.username },
                { $pull: { feedbacks: { _id: feedbackToDeleteID } } },
                function (err, result) {
                    if (err) {
                        console.log(err);

                        return res.json({ "error": "Couldn't delete the feedback" });
                    } else {
                        if (result.modifiedCount === 0) {
                            return res.json({ "error": "Feedback with that ID doesn't exist", status: 200 });
                        } else {
                            return res.json({ "success": "Feedback has been deleted", status: 200 });

                        }
                    }
                }
            );
        } catch (e) {
            res.json({ "success": "false" });
        }
    }

    async postFeedback(req, res) {
        const restaurantID = req.params['restaurantID'];
        console.log(restaurantID);

        if (!req.body.feedback) {
            return res.json({ "error": "No feedback provided" });
        }

        const feedback = { feedback: req.body.feedback, date: req.body.date };
        console.log(feedback);
        try {
            Admin.updateOne(
                { restaurantID: restaurantID },
                { $addToSet: { feedbacks: feedback } },
                function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.json({ "error": "Couldn't add the feedback" });
                    } else {
                        return res.json({ "success": "Feedback has been added", status: 200 });
                    }
                }
            )
        } catch (e) {
            console.log(e);
            return res.json({ "error": "DB error" });
        }
    }

    async getTableNumber(req, res) {
        try {
            const searchedUser = await Admin.findOne({ username: req.user.username });
            return res.json({ "success": searchedUser.tableNumber, status: 200 })
        } catch (e) {
            return res.json({ "error": "DB error" });
        }
    }

    async changeTableNumber(req, res) {
        let newNumberTables;
        try{
            newNumberTables = parseInt(req.body.tableNumber);
        }catch(e){
            return res.json({"error": "New value invalid"});
        }
        
        try {
            Admin.updateOne(
                { username: req.user.username },
                {$set: {tableNumber: newNumberTables}},
                function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.json({ "error": "Couldn't change the number of tables" });
                    } else {
                        return res.json({ "success": "Changed the number of tables", status: 200 });
                    }
                }
            )
        } catch (e) {
            return res.json({ "error": "DB error" });
        }
    }

    async deleteServer(req, res) {
        let serverToDelete = req.body.username;
        try {
            Admin.updateOne(
                { username: req.user.username },
                { $pull: { servers: { username: serverToDelete } } },
                function (err, result) {
                    if (err) {
                        console.log(err);

                        return res.json({ "error": "Couldn't delete the server" });
                    } else {
                        if (result.modifiedCount === 0) {
                            return res.json({ "error": "Server with that username doesn't exist", status: 200 });
                        } else {
                            return res.json({ "success": "Server has been deleted", status: 200 });

                        }
                    }
                }
            );
        } catch (e) {
            res.json({ "success": "false" });
        }
    }



    async postRating(req, res) {
        const restaurantID = req.params['restaurantID'];

        if (!req.body.rating) {
            return res.json({ "error": "No rating provided" });
        }

        const rating = { rating: req.body.rating, date: req.body.date }


        console.log(restaurantID);
        console.log(rating);
        try {
            Admin.updateOne(
                { restaurantID: restaurantID },
                { $addToSet: { ratings: rating } },
                function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.json({ "error": "Couldn't add the rating" });
                    } else {
                        return res.json({ "success": "Rating has been added", status: 200 });
                    }
                }
            )
        } catch (e) {
            console.log(e);
            return res.json({ "error": "DB error" });
        }
    }

    async addServer(req, res) {

        const searchedUser = await Admin.findOne({ username: req.user.username });

        if (searchedUser.servers.find((server) => server.username === req.body.username)) {
            return res.json({ "error": "server with that username already exists" });
        }

        let newServer = { username: req.body.username, password: req.body.password };



        try {
            Admin.updateOne(
                { username: req.user.username },
                { $addToSet: { servers: newServer } },
                function (err, result) {
                    if (err) {
                        return res.json({ "error": "Couldn't add the server" });
                    } else {
                        return res.json({ "success": "Server has been added", status: 200 });
                    }
                }
            );
        } catch (e) {
            console.log(e);
            return res.json({ "error": "DB error" });
        }

    }
}

module.exports = new Controllers();