const express = require('express');
const cookieParser = require('cookie-parser');
const dbconnect = require('./connections/db');

const app = express();

app.use(express.json());

const authRoute = require('./routes/authRoute');
const scrapRoute = require('./routes/scrapRoute');
const logger = require('./utils/logger');

// !Connect to the database
dbconnect();

app.use(cookieParser());

// !Import routes
app.use('/api/v1', authRoute);
app.use('/api/v1', scrapRoute);

// !Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

