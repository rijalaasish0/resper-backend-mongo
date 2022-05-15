const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb+srv://admin:newpassword@backendtestcluster.e3vce.mongodb.net/backendTestCluster?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;

const Server = new Schema({
    username: String,
    fullname: String,
    password: String
})

const Rating = new Schema({
    rating: Number,
    date: String
})

const Feedback = new Schema({
    feedback: String,
    date: String
})

const Admin = new Schema({
    username: {type: String, required: true},
    restaurantID: Number,
    password: String,
    restaurantName: {type: String, required: true},
    tableNumber: {type: Number, default:10},
    feedbacks: [Feedback],
    isAdmin: {type: Boolean, default: true},
    ratings: [Rating],
    servers: [Server]
})

Admin.plugin(passportLocalMongoose);
module.exports = mongoose.model('userData', Admin, 'userData');