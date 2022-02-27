const express = require('express');
const ToursController = require('../controllers/toursController');
const authController = require('../controllers/authController');
const reviewRouter = require('./../routes/reviewsRoutes');

/********************************************* MIDDLEWARES *********************************************/
const router = express.Router();

/*router.param('id', ToursController.checkID)*/

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-tours')
  .get(ToursController.aliasTopTours, ToursController.getAllTours);

router
  .route('/tour-stats')
  .get(ToursController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    ToursController.getMonthlyPlan
   );

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(ToursController.getToursWithin);

router
  .route('/distances/:latlng/unit/:unit')
  .get(ToursController.getDistances)

router
  .route('/')
  .get(ToursController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    ToursController.createTour
  );

router
  .route('/:id')
  .get(ToursController.getTourById)
  .patch(authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    ToursController.editTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    ToursController.deleteTour
  );

module.exports = router;
