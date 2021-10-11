//https://medium.com/swlh/how-to-create-your-first-mern-mongodb-express-js-react-js-and-node-js-stack-7e8b20463e66
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './dbSetup';
import router from './routes';
import startScheduler from './speedTestScheduler';

console.log("starting");
const scheduler = startScheduler();

const app = express()
const apiPort = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World from the backend!')
})

app.use("/api", router);

//app.use('/api', movieRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))

// when stopping your app
process.on('SIGTERM', function() {
    scheduler.stop();
});

console.log("started");