const express = require('express');
const morgan = require('morgan');

const app = express();
const toursRouter = require('./routes/toursRoutes')
const usersRouter = require('./routes/usersRoutes')

/********************************************* MIDDLEWARES *********************************************/

app.use(express.json());

// custom middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
})

// third party middleware
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// files middleware
app.use(express.static(`${__dirname}/public`))

// router middleware
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;

