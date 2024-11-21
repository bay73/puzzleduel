const mongoose = require('mongoose')

require('dotenv').config();

const config = require('../config/keys');


const connectDBs = () => {
    try {
        const db = mongoose.createConnection(config.mongoURI)
        const logDb = mongoose.createConnection(config.mongoLogURI)
        return { db, logDb }
    } catch (error) {
        console.error(`Error:${error.message}`)
        process.exit(1)
    }
}

module.exports = { connectDBs }