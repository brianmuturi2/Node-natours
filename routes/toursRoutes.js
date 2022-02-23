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

// POST /tour/tourId/reviews
/*router
  .route('/:tourId/reviews')
  .post(authController.protect, authController.restrictTo('user', 'admin', 'guide'), reviewController.createReview)*/


module.exports = router;
