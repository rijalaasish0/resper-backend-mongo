const { decode } = require('jsonwebtoken');
const Admin = require('../models/admin');
const jwt = require("jsonwebtoken");


const isAdmin = async (req, res, next) => {
    let userIsAdmin = await req.user.isAdmin;
    console.log("token", req.user);
    if(userIsAdmin){
        next();
    }else{
        console.log("Failed to Verify")
        res.redirect('/fail');
    }
}

const isServer = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token){
        return res.json({"error":"A token is required for authentication"});
    }
    console.log('token '+ token);
    try{
        const decoded = jwt.verify(token, "bhalubangbest");
        console.log('decoded ' + decoded.username + decoded.user_id);
        req.user = decoded;
    }catch(e){
        console.log(e)
        return res.json({"error": "Invalid Token"});
    }
    return next();
}

module.exports = {isAdmin, isServer};