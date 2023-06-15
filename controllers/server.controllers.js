const Admin = require('../models/admin');
const jwt = require("jsonwebtoken");
const Time = require("../models/time");
const { update } = require('../models/admin');

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
                return res.json({ "error": "invalid restaurant ID"});
            }

            const serverUser = restaurantAdmin.servers.find((server) => server.username === username);

            if (serverUser) {
                if (serverUser.password === password) {
                    const token = jwt.sign(
                        { user_id: serverUser._id, username: username, fullname: serverUser.fullname, currentWeek: serverUser.currentWeek, hoursWorked: serverUser.hoursWorked },
                        "bhalubangbest",
                        {
                            expiresIn: "1h",
                        }
                    );
                    return res.json({ "success": serverUser, "token": token, "availableTabls": [], "status": 200 ,"restaurantId": reqRestaurantID, "restaurantAdmin": restaurantAdmin});
                } else {
                    return res.json({ "error": "invalid password" });
                }
            }else{
                return res.json({"error": "user not found"});
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
            if (success === 0) {
                res.json({ "error": "Already checked in", status: 404 });
            } else {
                res.json({ "success": checkInTime });
            }
        } catch (e) {
            console.log(e);
            res.json({ "error": e });
        }

    }

    async getServer(req, res) {
        // const reqRestaurantID = parseInt(req.params['restaurantID']);
        // const username = req.user.username;
        // const restaurantAdmin = await Admin.findOne({ restaurantID: reqRestaurantID });
        // let serverUser = restaurantAdmin.servers.find((server) => server.username === username);
        // await delete serverUser.password;
        console.log(Time.getWeekNumber());
        res.json({ "success": req.user });
    }

    async checkOut(req, res) {
        const reqRestaurantID = req.params['restaurantID'];
        const username = req.user.username;
        const serverID = req.user.user_id;
        const workedWeek = req.user.currentWeek;

        const restaurantAdmin = await Admin.findOne({ restaurantID: reqRestaurantID });
        const serverUser = restaurantAdmin.servers.find((server) => server.username === username);
        const weeklyHours = serverUser.weeklyHours;

        const thisWeek = Time.getWeekNumber();

        const date = new Date();
        const checkOutTime = date.getUTCMinutes() + 1;
        const success = Time.checkOutUser(reqRestaurantID, username, checkOutTime);
        if (success === 0) {
            res.json({ "error": "User not checked in or just checked in", status: 404 });
        } else {
            const todaysDate = Date().toString();

            console.log(reqRestaurantID, serverID);
            Admin.updateOne(
                { restaurantID: reqRestaurantID, "servers._id": serverID },
                { $push: { "servers.$.hoursWorked": { date: todaysDate, numHours: success } } },
                function (err, result) {
                    if (err) {
                        console.log(err);
                        return res.json({ "error": "DB error" });
                    } else {
                        console.log(result);
                    }
                }
            )

            if (workedWeek === thisWeek) {
                console.log(weeklyHours + " " + success);

                const updatedHours = weeklyHours + success;
                Admin.updateOne(
                    { restaurantID: reqRestaurantID, "servers._id": serverID },
                    { $set: { "servers.$.weeklyHours": updatedHours } },
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            return res.json({ "error": "DB error" });
                        } else {
                            console.log(result);
                            return res.json({ "success": "Hours have been added", status: 200, hours: success });
                        }
                    }
                )
            } else {
                Admin.updateOne(
                    { restaurantID: reqRestaurantID, "servers._id": serverID },
                    { $set: { "servers.$.currentWeek": thisWeek, "servers.$.weeklyHours": success }, },
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            return res.json({ "error": "DB error" });
                        } else {
                            console.log(result);
                            return res.json({ "success": "Hours have been added", status: 200, hours: success });
                        }
                    }
                )

            }
        }
    }


    async getRequests(req, res){
        const reqRestaurantID = (req.params.restaurantID);

        Admin.findOne(
            { restaurantID: reqRestaurantID },
            'servedTables',
            (err, admin) => {
                if (err) {
                    console.error('Error fetching servedTables:', err);
                } else if (admin && admin.servedTables.length > 0) {
                    const servedTables = admin.servedTables;
                    // // console.log('Served Tables:', servedTables);
                    // // console.log(servedTables[0].requests)
                    // for (const request of servedTables){
                    //     if(request.table == 3){
                    //         console.log(request.requests)
                    //     }
                    //   }
                    // //   console.log(this.tableInfo)


                    return res.json({"success": servedTables, "status": 200})
                    // Access the servedTables object as needed
                } else {
                    console.log('Admin not found or servedTables not available');
                    return res.json({ "error": "DB error" });
                }
            }
        );
    }

    async getServerRequests(req, res){
        const reqRestaurantID = req.params.restaurantID;
        const username = req.params.username;


        Admin.findOne(
            { restaurantID: reqRestaurantID, 'servers.username': username },
            'servedTables',
            (err, admin) => {
                if (err) {
                    console.error('Error fetching servedTables:', err);
                } else if (admin && admin.servedTables.length > 0) {
                    const serverServedTables = admin.servedTables.filter(table => table.server &&table.server.username === username);
                    return res.json({"success": serverServedTables, "status": 200})

                } else {
                    console.log('Admin not found or servedTables not available');
                    return res.json({ "error": "DB error" });
                }
            }
        );
    }


    async postTablesToServers(req, res){
        const table = req.body.assignTable;
        const username = req.body.username;
        const reqRestaurantID = parseInt(req.params['restaurantID']);
        const user = await Admin.findOne({ restaurantID: reqRestaurantID });
        const tables = user.servedTables
        

        Admin.findOne({ restaurantID: reqRestaurantID }, (err, admin) => {
            if (err) {
              // Handle the error
              console.log(err)
            } else if (admin) {
              // Find the servedTables object with the matching table number
                const servedTable = admin.servedTables.find((servedTable) => servedTable.table === parseInt(table));
                const server = admin.servers.find((server) => server.username === username);
                
                console.log(servedTable, table, "tables")
                if (servedTable) {
                    // Update the server object in the existing servedTable
                    servedTable.server = server;
                    console.log("Updating")
                } else {
                    // Create a new servedTable object and assign the server
                    const newServedTable = {
                    table: table,
                    server: server,
                    requests: []
                    };
                    admin.servedTables.push(newServedTable);
                }
                // Save the updated admin document
                admin.save((err) => {
                    if (err) {console.log(err)} 
                    else {
                        // Server object added/updated successfully
                        console.log('Server object added/updated successfully');
                        return res.json({"success": "added/updated successfully", "status": 200});
                    }
                });
            } else {
              // Admin document not found
              return res.json({"error": "DB error"});
            }
          });
    }

    async getTablesAssignedArray(req, res){
        const reqRestaurantID = (req.params.restaurantID);
        const username = req.params.username;
        // console.log(username, reqRestaurantID)

        Admin.findOne({
            restaurantID: reqRestaurantID,
            'servers.username': username
          }, 'servedTables')
            // .populate('servers.server')
            .exec((err, admin) => {
              if (err) {
                // Handle the error
                console.log(err)
                return res.json({ "error": "DB error" });
              } else {
                const serverServedTables = admin.servedTables.filter(table => table.server &&table.server.username === username);
                // Access the servedTables objects that have the same server
                const assignedTables = []
                for (const elem of serverServedTables){
                    if (!assignedTables.includes(elem.table)){
                        assignedTables.push(elem.table)
                    }
                  }
                return res.json({"success": assignedTables, "status": 200})
              }
            });
        
    }

    async updateTableServer(req, res){
     const tableToDelete = req.body.table;
     const reqRestaurantID = req.params.restaurantID;

     console.log(tableToDelete, reqRestaurantID)

     
     Admin.findOneAndUpdate(
        { restaurantID: reqRestaurantID, 'servedTables.table': tableToDelete },
        { $set: { 'servedTables.$.server': null } },
        { new: true }
      )
        .then(updatedAdmin => {
          if (updatedAdmin) {
            // The server field in servedTables has been updated to null
            console.log(updatedAdmin);
            const serverServedTables = updatedAdmin.servedTables.filter(table => table.server);
            return res.json({"success": "updated to null", "status" : 200})
          } else {
            // Document not found or no matching servedTable
            console.log('Admin document not found or no matching servedTable.');
            return res.json({"error": "DB error"})

          }
        })
        .catch(error => {
          // Handle the error
          console.error(error);
        });
    }

    async updateRequest(req, res){
        const requestToDelete = req.body.request;
        const serverUsername = req.body.username;
        const requestToDeleteID = requestToDelete._id
        const reqRestaurantID = req.params.restaurantID;

        console.log(requestToDeleteID)

        Admin.findOneAndUpdate(
            {
              restaurantID: reqRestaurantID,
              "servers.username": serverUsername,
              "servedTables.requests._id": requestToDeleteID,
            },
            {
            $pull: {
                  "servedTables.$[st].requests": { _id: requestToDeleteID },
                },
              },
              {
                arrayFilters: [
                  { "st.requests._id": requestToDeleteID },
                ],
                new: true,
              },
            (err, result) => {
              if (err) {
                console.error("Error removing request:", err);
                return res.json({"error": "DB error"})
              } else {
                console.log("Request removed successfully:");
                return res.json({"success": "Removed Request", "status": 200})
              }
            }
          );

        }
}

module.exports = new ServerControllers();