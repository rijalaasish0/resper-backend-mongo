const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// mongodb+srv://admin:newpassword@backendtestcluster.e3vce.mongodb.net/backendTestCluster?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://simantsingh09:Davschool.123@cluster0.iqiphp7.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;


const HoursWorked = new Schema({
    date: Date,
    numHours: Number,
})

const requests = new Schema({
    request : String, time : Date,
})


const Server = new Schema({
    username: String,
    fullname: String,
    password: String,
    currentWeek: Number,
    weeklyHours: {type: Number, default:0},
    hoursWorked: [HoursWorked],
})

const Rating = new Schema({
    rating: Number,
    date: String
})


const Feedback = new Schema({
    feedback: String,
    date: String
})

const servedTables = new Schema({
    table: Number, 
    server : {type: Server, default:null}, 
    requests : [requests],
})

const Admin = new Schema({
    username: {type: String, required: true},
    restaurantID: Number,
    password: String,
    restaurantName: {type: String, required: true},
    feedbacks: [Feedback],
    isAdmin: {type: Boolean, default: true},
    ratings: [Rating],
    servers: [Server],
    tableNumber: {type: Number, default:10},
    servedTables: [servedTables],
})

Admin.plugin(passportLocalMongoose);
module.exports = mongoose.model('userData', Admin, 'userData');