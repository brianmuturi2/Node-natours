const fs = require('fs');
const Tour = require('../models/TourModel')

/********************************************* CUSTOM MIDDLEWARE CALLBACK *********************************************/
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

/********************************************* IO OPERATIONS *********************************************/

// Get tours to serve from json file
/*const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));*/

/********************************************* ROUTE HANDLERS/ CONTROLLERS *********************************************/

// Get all tours
exports.getAllTours = async (req, res) => {
  try {
    // build query
    // 1A) Filtering
    let newParams = {...req.query};
    const excludedParams = ['page', 'sort', 'limit', 'fields'];
    excludedParams.forEach(cur => delete newParams[cur]);

    // 1B) Advanced Filtering
    // mongodb filtering with operator example
    // {difficulty: 'easy', duration: {$gte: 5}}
    let paramString = JSON.stringify(newParams);
    paramString = paramString.replace(/\b(gte|gt|lt|lte)\b/ig, i => `$${i}`)
    newParams = JSON.parse(paramString);
    let query = Tour.find(newParams)

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt')
    }

    // 3) Field limiting/ selecting fields/ projecting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // 4) Pagination
    let page = +req.query.page || 1;
    query = query.skip(10).limit(20);
    const limit = +req.query.limit || 100;
    const skip = (page-1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page doesnt exist');
    }

    const tours = await query;

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

}

// Get tour by id
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
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
}

// Create tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
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
    })
  }
}

// Edit tour
exports.editTour = async (req, res) => {
  try {
    const tourEdited = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
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
}

// Delete tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      message: 'Successfully deleted tour!'
    })
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Could  not delete tour!'
    })
  }
}
