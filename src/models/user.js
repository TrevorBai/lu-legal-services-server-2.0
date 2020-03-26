const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid.');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error("Password cannot contain 'password'.");
      }
    }
  }
});

// Need bind this so do not use arrow function here
userSchema.pre('save', async function (next) {
  const user = this;

  console.log('just before saving!');



  next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
