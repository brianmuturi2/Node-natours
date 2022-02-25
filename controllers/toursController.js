const fs = require('fs');
const Tour = require('../models/TourModel');
const APIFeatures = require('../utils/ApiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');

/********************************************* CUSTOM MIDDLEWARE CALLBACK *********************************************/
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

/********************************************* IO OPERATIONS *********************************************/

// Get tours to serve from json file
/*const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));*/

/********************************************* ROUTE HANDLERS/ CONTROLLERS *********************************************/

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { numTours: -1 }
    },
    {
      $match: { _id: { $ne: 'EASY' } }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});


exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

// Get all tours
exports.getAllTours = factory.getAll(Tour);

// Get tour by id
exports.getTourById = factory.getOne(Tour, { path: 'reviews' });

// Create tour
exports.createTour = factory.createOne(Tour);

// Edit tour
exports.editTour = factory.updateOne(Tour);

// Delete tour
exports.deleteTour = factory.deleteOne(Tour);

// '/tours-within/:distance/center/:latlng/unit/:unit'
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat, lng', 400));
  }

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  console.log('geospatial data is:', distance, latlng, unit);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});
