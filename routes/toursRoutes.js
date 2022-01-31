const express = require('express');
const ToursController = require('../controllers/toursController');
const authController = require('../controllers/authController');

/********************************************* MIDDLEWARES *********************************************/
const router = express.Router();

/*router.param('id', ToursController.checkID)*/

router
  .route('/top-5-tours')
  .get(ToursController.aliasTopTours, ToursController.getAllTours);

router
  .route('/tour-stats')
  .get(ToursController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(ToursController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, ToursController.getAllTours)
  .post(ToursController.createTour);

router
  .route('/:id')
  .get(ToursController.getTourById)
  .patch(ToursController.editTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    ToursController.deleteTour
  );


module.exports = router;
