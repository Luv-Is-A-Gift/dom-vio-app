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
      relationshipToUser: {type: String},
      email: {type: String},
      phone_number: {type: String},
    }],
    logs:[{
      timestamp: {type: Date, default: Date.now},
      location: {type: String},
      details: {type: String, maxlength: 2000},
      level_of_situation: {type: Number}
    }]

});

const User = mongoose.model('User', userSchema)
module.exports = User
