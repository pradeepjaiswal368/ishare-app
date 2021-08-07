require('dotenv').config();
const mongoose = require('mongoose');




function connectDB() {
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });

    const connection = mongoose.connection;

    connection.once('open', ()=> {
        console.log('Database is connected');
    }).catch(err => {
        console.log('Connection is  failed');
    })

}

module.exports = connectDB;  