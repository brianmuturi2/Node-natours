const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');

const app = express();
const toursRouter = require('./routes/toursRoutes');
const usersRouter = require('./routes/usersRoutes');

/********************************************* MIDDLEWARES *********************************************/

app.use(express.json());

// third party middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// files middleware
app.use(express.static(`${__dirname}/public`));

// router middleware
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.all('*', (req, res, next) => {
  const errMessage = `Can't find ${req.originalUrl} on this server`;
  const errCode = 404;
  next(new AppError(errMessage, errCode)); // next takes error as argument. express will skip all middlewares and execute error handling middleware
});

// error middleware
app.use(errorController);

module.exports = app;

