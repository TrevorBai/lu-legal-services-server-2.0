const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
      trim: true
    },
    appointmentTime: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      trim: true
    },
    message: {
      type: String,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
