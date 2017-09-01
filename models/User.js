const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone_number: {type: String, required: true, unique: true},
    address: {type: String, required: true},
    addressInfo: {type: String},
    safety_contacts:[{
      firstname: {type: String, required: true, unique: true},
      lastname: {type: String, required: true, unique: true},
      relationshipToUser: {type: String, require: true},
      email: {type: String, required: true, unique: true},
      phone_number: {type: String, required: true, unique: true},
    }],
    logs:[{
      timestamp: {type: Date, default: Date.now},
      location: {type: String, required: true},
      details: {type: String, required: true, unique: true, maxlength: 2000},
      level_of_situation: {type: Number, required: true}
    }]

});

const User = mongoose.model('User', userSchema)
module.exports = User
