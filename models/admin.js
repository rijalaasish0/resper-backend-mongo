const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect('mongodb+srv://admin:newpassword@backendtestcluster.e3vce.mongodb.net/backendTestCluster?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const Admin = new Schema({
    username: String,
    password: String
})

Admin.plugin(passportLocalMongoose);
module.exports = mongoose.model('userData', Admin, 'userData');