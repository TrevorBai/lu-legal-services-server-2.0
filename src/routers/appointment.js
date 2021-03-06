const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const {
  bookAppointment,
  readAppointments,
  readAppointmentById,
  deleteAppointmentById,
  updateAppointmentById,
  appointmentAggregation
} = require('../controllers/appointment');

// *********************************************************
//   Operations which don't need to be authenticated first
// *********************************************************
router.get('/aggregation', appointmentAggregation);

// *********************************************************
//     Operations which need to be authenticated first
// *********************************************************
router.post('/', auth, bookAppointment);
router.get('/', auth, readAppointments);
router.get('/:id', auth, readAppointmentById);
router.delete('/:id', auth, deleteAppointmentById);
router.patch('/:id', auth, updateAppointmentById);

module.exports = router;
