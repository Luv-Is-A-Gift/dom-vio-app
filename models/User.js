const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    dateOfBirth: {type: String},
    firstname: {type: String, trim: true},
    lastname: {type: String, trim: true},
    username: {type: String, trim: true},
    password: {type: String},
    email: {type: String},
    phone_number: {type: String},
    homeAddress: {type: String},
    homeAddressInfo: {type: String},
    addlAddress: {type: String},
    addlAddressInfo: {type: String},
    safety_contact
    :[{
      firstname: {type: String, trim: true},
      lastname: {type: String, trim: true},
      relationshipToUser: {type: String, trim: true},
      email: {type: String, trim: true},
      phone_number: {type: String},
    }],
    logs:[{
      timestamp: {type: Date, default: Date.now},
      location: {type: String, trim: true},
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
