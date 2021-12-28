const fs = require('fs');
const Tour = require('../models/TourModel');
const APIFeatures = require('../utils/ApiFeatures');

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

// Get all tours
exports.getAllTours = async (req, res) => {
  try {

    const features = new APIFeatures(Tour, req.query).filter().sort().limitFields().paginate();

    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e
    });
  }

};

// Get tour by id
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e
    });
  }
};

// Create tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: e
    });
  }
};

// Edit tour
exports.editTour = async (req, res) => {
  try {
    const tourEdited = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: tourEdited
      }
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e
    });
  }
};

// Delete tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'Successfully deleted tour!'
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Could  not delete tour!'
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e
    });
  }
};


exports.getMonthlyPlan = async (req, res) => {
  try {
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
          _id: {$month: '$startDates'},
          numTourStarts: {$sum: 1},
          tours: {$push: '$name'},
        }
      },
      {
        $addFields: {month: '$_id'}
      },
      {
        $project: {
          _id: 0,
        }
      },
      {
        $sort: {numTourStarts: -1}
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
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      message: e
    });
  }
};
