import mongoose from 'mongoose';

console.log("initalizing the mongo connection");

mongoose
    .connect('mongodb://mongo:27017/speedtest').then(() => console.log("Connected to mongodb"))
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

mongoose.set('debug', true);

export default db;