const mongoose = require('mongoose')

require('dotenv').config();

const config = require('../config/keys');


const connectDBs = () => {
    try {
        const db = await mongoose.createConnection(config.mongoURI).asPromise();
        const logDb = await mongoose.createConnection(config.mongoLogURI).asPromise();
        return { db, logDb }
    } catch (error) {
        console.error(`Error:${error.message}`)
        process.exit(1)
    }
}

module.exports = { connectDBs }