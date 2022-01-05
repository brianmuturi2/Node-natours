const AppError = require('./../utils/AppError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`
  return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
}

const sendErrorProd = (err, res) => {
  // operation (errors that we explicitly created; trusted; send msg tp client)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // programming or other unknown error; dont leak error details
  } else {
    // 1) log error
    console.error('ERROR', err);

    // 2) send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    })
  }
}

errorController = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err};
    if (error.name === 'CastError') error = handleCastErrorDB(error)

    sendErrorProd(error, res);
  }

};

module.exports = errorController;
