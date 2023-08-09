const mongoose = require('mongoose');
const { isEmail } = require('validator');
const UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      validate: [isEmail, 'invalid email'],
      createIndexes: { unique: true },
    },
    password: { type: String, required: true },
  });

const model = mongoose.model('Users', UserSchema)

module.exports = model;