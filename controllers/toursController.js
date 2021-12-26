const fs = require('fs');
const Tour = require('../models/TourModel')

/********************************************* IO OPERATIONS *********************************************/

// Get tours to serve from json file
/*const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));*/

/********************************************* ROUTE HANDLERS/ CONTROLLERS *********************************************/

// Get all tours
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find()
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
