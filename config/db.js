const mongoose = require('mongoose')

require('dotenv').config();

const config = require('../config/keys');

var db
var logDb

const connectDBs = () => {
    try {
        if (db == undefined) {
          db = mongoose.createConnection(config.mongoURI)
          db.on('connected', () => console.log('Db connected'));
          db.on('open', () => console.log('Db open'));
          db.on('disconnected', () => console.log('Db disconnected'));
        }
        if (logDb == undefined) {
          logDb = mongoose.createConnection(config.mongoLogURI)
          logDb.on('connected', () => console.log('logDb connected'));
          logDb.on('open', () => console.log('logDb open'));
          logDb.on('disconnected', () => console.log('logDb disconnected'));
        }
        return { db, logDb }
    } catch (error) {
        console.error(`Error:${error.message}`)
        process.exit(1)
    }
}

module.exports = { connectDBs }