require('dotenv').config();

module.exports = {
    MONGO: process.env.MONGO,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    TOKEN_EXPIRATION: '15d',
}