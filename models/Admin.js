const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    adminFirstname: {type: String, required: true},
    adminLastname: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},

});

adminSchema.pre('save', function (next) {
   if (!this.isModified('password')) {
      return next();
   }
   var hash = bcrypt.hashSync(this.password, 8);
   this.password = hash;
   next();

});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
