const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');
const toursRouter = require('./routes/toursRoutes');
const usersRouter = require('./routes/usersRoutes');
const reviewRouter = require('./routes/reviewsRoutes');
const viewRouter = require('./views/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/********************************************* MIDDLEWARES *********************************************/

// GLOBAL MIDDLEWARES

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'data:', 'blob:'],

    imgSrc: ["'self'", 'data:', 'blob:'],

    workerSrc: ["'self'", 'data:', 'blob:'],

    childSrc: ["'self'", 'data:', 'blob:'],

    fontSrc: ["'self'", 'https:', 'data:'],

    scriptSrc: ["'self'", 'unsafe-inline'],

    scriptSrc: ["'self'", 'https://*.cloudflare.com'],

    scriptSrcElem: ["'self'",'https:', 'https://*.cloudflare.com'],

    styleSrc: ["'self'", 'https:', 'unsafe-inline'],

    connectSrc: ["'self'", 'data', 'https://*.cloudflare.com', 'ws://127.0.0.1:*', 'http://127.0.0.1:*', 'http://localhost:*', 'https://*.tiles.mapbox.com', 'https://api.mapbox.com', 'https://events.mapbox.com']
  },
}));

app.use(cors());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
// Limit body size
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Implement parameter pollution
const whitelist = ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
app.use(hpp({
  whitelist
}));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
})

// Mount Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  const errMessage = `Can't find ${req.originalUrl} on this server`;
  const errCode = 404;
  next(new AppError(errMessage, errCode)); // next takes error as argument. express will skip all middlewares and execute error handling middleware
});

// error middleware
app.use(errorController);

module.exports = app;

