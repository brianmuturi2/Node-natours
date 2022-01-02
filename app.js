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
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  })
})

module.exports = app;

