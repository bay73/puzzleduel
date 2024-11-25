const mongoose = require('mongoose')

require('dotenv').config();

const config = require('../config/keys');

var dataDb
var logDb

const connectDBs = () => {
    try {
        if (dataDb == undefined) {
          dataDb = mongoose.createConnection(config.mongoDataURI)
          dataDb.on('connected', () => console.log('dataDb connected'));
          dataDb.on('open', () => console.log('dataDb open'));
          dataDb.on('disconnected', () => console.log('dataDb disconnected'));
        }
        if (logDb == undefined) {
          logDb = mongoose.createConnection(config.mongoLogURI)
          logDb.on('connected', () => console.log('logDb connected'));
          logDb.on('open', () => console.log('logDb open'));
          logDb.on('disconnected', () => console.log('logDb disconnected'));
        }
        return { dataDb, logDb }
    } catch (error) {
        console.error(`Error:${error.message}`)
        process.exit(1)
    }
}

module.exports = { connectDBs }