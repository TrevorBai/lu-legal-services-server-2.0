require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT;

// Connect to database
require('./db/mongoose');

const userRouter = require('./routers/user');
const appointmentRouter = require('./routers/appointment');

app.use(cors());
app.use(express.json());
app.use('/api', userRouter);
app.use('/api', appointmentRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
