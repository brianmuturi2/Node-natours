const express = require('express');
const reviewController = require('./../controllers/reviewsController');
const authController = require('./../controllers/authController');

const router = express.Router({mergeParams: true});

router.route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protect, authController.restrictTo('user', 'admin', 'guide'), reviewController.createReview)

router.route('/:id')
  .delete(authController.protect, authController.restrictTo('user', 'admin', 'guide'), reviewController.deleteReview)

module.exports = router;