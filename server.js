const mongoose = require('mongoose');
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({path: './config.env'})

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(conn => {
  console.log('DB Connection is')
})

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  // shut down application; e.g if app cant connect to db, it wont work thus shutting down is the best solution
  // the problem with process.exit is an abrupt way of ending a program, aborting all running or pending requests
  // you can shut down gracefully, close the server, close the application
  // you can have a tool to restart the app or the platform hosting the app can restart it automatically
  server.close(() => {
    process.exit(1); // code 0 is success; code 1 is uncalled exception
  });
})

module.exports = app;
