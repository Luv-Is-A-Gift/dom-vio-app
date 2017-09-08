const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    dateOfBirth: {type: String},
    firstname: {type: String},
    lastname: {type: String},
    username: {type: String},
    password: {type: String},
    email: {type: String},
    phone_number: {type: String},
    homeAddress: {type: String},
    homeAddressInfo: {type: String},
    addlAddress: {type: String},
    addlAddressInfo: {type: String},
    safety_contact
    :[{
      firstname: {type: String},
      lastname: {type: String},
      relationshipToUser: {type: String},
      email: {type: String},
      phone_number: {type: String},
    }],
    logs:[{
      timestamp: {type: Date, default: Date.now},
      location: {type: String},
      details: {type: String, maxlength: 2000},
      level_of_situation: {type: String}
    }]

});

userSchema.pre('save', function (next) {
   if (!this.isModified('password')) {
      return next();
   }
   var hash = bcrypt.hashSync(this.password, 8);
   this.password = hash;
   next();

});

const User = mongoose.model('User', userSchema);
module.exports = User;
