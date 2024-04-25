const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE)

const connection = mongoose.connection;

connection.on('connected' , ()=>{
    console.log('Datababse connected successfully');
})

connection.on('error' , ()=>{
    console.log('Datababse connected failed!');
})

module.exports = connection;
