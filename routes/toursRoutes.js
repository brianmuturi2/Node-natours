const express = require('express');
const {getAllTours, createTour, getTourById, editTour, deleteTour} = require('../controllers/toursController')

const router = express.Router();

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(editTour)
  .delete(deleteTour);


module.exports = router;