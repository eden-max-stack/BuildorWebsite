const mongoose = require('mongoose');
require('dotenv').config({ path: '../../env.local'});

const ML_DB_CONN_STRING = "mongodb://localhost:27017/ML_DB";
const connections = {
    ML_DB: mongoose.createConnection(ML_DB_CONN_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }),
};

console.log('Connected to MongoDB database.');

module.exports = connections;