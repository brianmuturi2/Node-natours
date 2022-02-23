const express = require('express');
const reviewController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protect, authController.restrictTo('user', 'admin', 'guide'), reviewController.setToursUserIds, reviewController.createReview);

router.route('/:id')
  .patch(authController.protect, authController.restrictTo('user', 'admin', 'guide'), reviewController.updateReview)
  .delete(authController.protect, authController.restrictTo('user', 'admin', 'guide'), reviewController.deleteReview)
  .get(authController.protect, authController.restrictTo('user', 'admin', 'guide'), reviewController.getReview);

module.exports = router;
