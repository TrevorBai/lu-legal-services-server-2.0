const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Appointment = require('./appointment');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
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
      },
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
      },
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
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('myAppointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'owner',
});

// It will applied to ***res.send(certainObject)***, express
// by default automatically stringify the object we passed in.
// We can convert it back to JSON and manipulate the object before
// sending it back.
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  // hide password and tokens array when sending back response
  delete userObject.password;
  delete userObject.confirmedPassword;
  delete userObject.tokens;

  return userObject;
};

// On instance
userSchema.methods.generateAuthToken = async function ( expiration = '1' ) {
  const user = this;

  // user._id 's type is ObjectId, JWT expects a string
  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, {
    expiresIn: `${expiration}h`,
  });

  // We are here implementing a Queue data structure.
  // Potentially, I could improve time complexity by using
  // other data structures other than array.
  // Using singly linked list fullfills the goal. However, to integrate
  // with mongoose schemaType seems like an amount of work.

  const expirationInMilliseconde = Number(expiration) * 3600 * 1000;

  // Clean up expired token in a hour
  setTimeout(async () => {
    user.tokens.shift();
    await user.save();
  }, expirationInMilliseconde);

  user.tokens.push({ token });
  await user.save();

  return token;
};

// On model
userSchema.statics.findByCredentials = async (
  email,
  password,
  login = true
) => {
  const user = await User.findOne({ email });

  if (login) {
    if (!user) {
      // Better not provide more specific info to decrease the security
      throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Unable to login');
    return user;
  }

  if (!user) throw new Error('Unable to identify you');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Unable to identify you');
  return user;
};

// Hash the plain text password before saving
// Need bind this so do not use arrow function here
userSchema.pre('save', async function (next) {
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

// Delete user appointments when user is removed
userSchema.pre('remove', async function (next) {
  const user = this;
  await Appointment.deleteMany({ owner: user._id });

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
