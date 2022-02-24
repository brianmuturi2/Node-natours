const express = require('express');
const reviewController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/')
  .get(reviewController.getAllReviews)
  .post(authController.restrictTo('user'), reviewController.setToursUserIds, reviewController.createReview);

router.route('/:id')
  .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
  .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview)
  .get(reviewController.getReview);

module.exports = router;
