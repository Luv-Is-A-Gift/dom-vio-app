<<<<<<< HEAD
const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, unique: true},
    phone_number: {type: String, required: true, unique: true},
    homeAddress: {type: String, required: true},
    addressInfo: {type: String},
    addlAddress: {type: String, required: true},

    safety_contact
    :[{
      firstname: {type: String, unique: true},
      lastname: {type: String, unique: true},
=======
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
>>>>>>> c63fdd36de8329e46f35934f78522d74633e21c8
      relationshipToUser: {type: String},
      email: {type: String},
      phone_number: {type: String},
    }],
    logs:[{
      timestamp: {type: Date, default: Date.now},
      location: {type: String},
      details: {type: String, maxlength: 2000},
<<<<<<< HEAD
      level_of_situation: {type: Number}
=======
      level_of_situation: {type: String}
>>>>>>> c63fdd36de8329e46f35934f78522d74633e21c8
    }]

});

<<<<<<< HEAD
const User = mongoose.model('User', userSchema)
module.exports = User
=======
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
>>>>>>> c63fdd36de8329e46f35934f78522d74633e21c8
