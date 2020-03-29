const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
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
  },
  confirmedPassword: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error("Password cannot contain 'password'.");
      }
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.generateAuthToken = async function() {
  const user = this;

  // user._id 's type is ObjectId, JWT expects a string
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET);

  user.tokens.push({token});
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    // Better not provide more specific info to decrease the security
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

// Hash the plain text password before saving
// Need bind this so do not use arrow function here
userSchema.pre('save', async function(next) {
  const user = this;

  if (user.password !== user.confirmedPassword) {
    throw new Error(
      'Confirmed password is not equal to the password typed in.'
    );
  }

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
    user.confirmedPassword = user.password;
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
