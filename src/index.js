require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT;

// Connect to database
require('./db/mongoose');

app.use(cors());
app.use(express.json());
app.use('/api', require('./routers'));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
