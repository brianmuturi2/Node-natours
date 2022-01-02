const express = require('express');
const morgan = require('morgan');

const app = express();
const toursRouter = require('./routes/toursRoutes')
const usersRouter = require('./routes/usersRoutes')

/********************************************* MIDDLEWARES *********************************************/

app.use(express.json());

// third party middleware
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// files middleware
app.use(express.static(`${__dirname}/public`))

// router middleware
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server`)
  err.status = 'fail';
  err.statusCode = 404;
  next(err); // next takes error as argument. express will skip all middlewares and execute error handling middleware
})

// error middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
  next();
})

module.exports = app;

