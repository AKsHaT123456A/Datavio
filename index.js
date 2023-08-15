const express = require('express');
const cookieParser = require('cookie-parser');
const dbconnect = require('./connections/db');

const app = express();
const apiPrefix = '/api/v1';
app.use(express.json());

const authRoute = require('./routes/authRoute');
const scrapRoute = require('./routes/scrapRoute');
const logger = require('./utils/logger');
const { auth } = require('./middleware/auth');

// !Connect to the database
dbconnect();

app.use(cookieParser());

// !Import routes
app.use('/',auth, (req,res)=>{
  return res.send("Welcome to Datavio")
});
app.use(`${apiPrefix}/auth`, authRoute);
app.use(`${apiPrefix}`, scrapRoute);

// !Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

