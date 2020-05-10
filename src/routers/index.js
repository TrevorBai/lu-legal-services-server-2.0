const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const appointmentRouter = require('./appointment');

router.use('/users', userRouter);
router.use('/appointments', appointmentRouter);

module.exports = router;
