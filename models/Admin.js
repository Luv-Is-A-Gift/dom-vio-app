const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    adminFirstname: {type: String, required: true},
    adminLastname: {type: String, required: true},
    adminUsername: {type: String, required: true, unique: true},
    adminPassword: {type: String, required: true},

}); 

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin

