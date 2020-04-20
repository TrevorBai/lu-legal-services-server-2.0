const mongoose = require('mongoose');
const Appointment = require('../models/appointment');

const bookAppointment = async (req, res) => {
  const appointment = new Appointment({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await appointment.save();
    res.status(201).send(appointment);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

const readAppointments = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const allAppointments = await Appointment.find();
      res.send(allAppointments);
    } else {
      // const appointments = await Appointment.find({ owner: req.user._id });
      await req.user.populate('myAppointments').execPopulate();
      res.send(req.user.myAppointments);
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

const readAppointmentById = async (req, res) => {
  const _id = req.params.id;
  try {
    const appointment = await Appointment.findOne({ _id, owner: req.user._id });

    if (!appointment) {
      return res.status(404).send();
    }
    res.send(appointment);
  } catch (e) {
    res.status(500).send();
  }
};

const deleteAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!appointment) {
      return res.status(404).send();
    }
    res.send(appointment);
  } catch (e) {
    res.status(500).send(e);
  }
};

const updateAppointmentById = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['task', 'appointmentTime', 'date', 'message'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!appointment) {
      return res.status(404).send();
    }

    updates.forEach((update) => (appointment[update] = req.body[update]));
    await appointment.save();
    res.send(appointment);
  } catch (e) {
    res.status(400).send(e);
  }
};

const appointmentAggregation = async (req, res) => {
  const db = mongoose.connection;

  const appointmentDateAndTime = db.collection('appointments').aggregate(
    [ // aggregation pipeline array
      {
        $project: {
          yearMonthDayUTC: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          appointmentTime: true
        }
      },
      { "$out": "appointmentDateAndTime" }
    ]
  );

  await appointmentDateAndTime.toArray();  // Form the collection

  const dateAndTime = db.collection('appointmentDateAndTime').aggregate([
    { $group: { _id: "$yearMonthDayUTC", appointmentTime: { $push: "$appointmentTime" } } }
  ]);
  const dateAndTimeArray = await dateAndTime.toArray();

  res.send(dateAndTimeArray);
};

module.exports = {
  bookAppointment,
  readAppointments,
  readAppointmentById,
  deleteAppointmentById,
  updateAppointmentById,
  appointmentAggregation,
};
