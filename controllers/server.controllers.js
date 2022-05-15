const Admin = require('../models/admin');
const jwt = require("jsonwebtoken");

class ServerControllers {
    async serverLogin(req, res) {
        try {
            const { username, password, fullname } = req.body;
            const reqRestaurantID = parseInt(req.params['restaurantID']);

            if (!(username && fullname && password && reqRestaurantID)) {
                return res.json({ "error": "all input required" });
            }

            const restaurantAdmin = await Admin.findOne({ restaurantID: reqRestaurantID });
            if(!restaurantAdmin){
                return res.json({ "error": "invalid restaurant ID" });
            }
            
            console.log('restaurantAdmin '+restaurantAdmin);
            const serverUser = restaurantAdmin.servers.find( (server) => server.username === username);
            console.log('serverUser '+serverUser);

            if(serverUser){
                if(serverUser.password === password){
                    const token = jwt.sign(
                        {user_id: serverUser._id, username: username, fullname: fullname},
                        "bhalubangbest",
                        {
                            expiresIn: "10h",
                        }
                    );                    
                    return res.json({"success":serverUser, "token":token, "status":200});
                }else{
                    return res.json({"error":"invalid password"});
                }
            }

        } catch (e) {
            console.log(e);
            res.json({"error":"DB error"});
        }
    }
}

module.exports = new ServerControllers();