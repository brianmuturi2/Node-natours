const mongoose = require('mongoose');
const Tour = require('./TourModel');

const reviewSchema = new mongoose.Schema({
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    },
  },
  {
    toJSON: { virtuals: true },  // field not in database but calculated will show in output
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
/*  this.populate({
    path: 'tour',
    select: 'name'
  }).populate({
    path: 'user',
    select: 'name photo'
  })*/
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
   const stats = await this.aggregate([
     {
       $match: {tour: tourId}
     },
     {
       $group: {
         _id: '$tour',
         nRating: { $sum: 1},
         avgRating: { $avg: '$rating'}
       }
     }
   ]);
   console.log('tour stats: ', stats);
   if (stats.length >= 1) {
     await Tour.findByIdAndUpdate(tourId, {
       ratingsQuantity: stats[0]['nRating'],
       ratingsAverage: stats[0]['avgRating']
     });
   } else {
     await Tour.findByIdAndUpdate(tourId, {
       ratingsQuantity: 0,
       ratingsAverage: 4.5
     });
   }
}

reviewSchema.post('save', function() {
  // this points to current document being saved i.e current review
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate/ Delete only have query middleware & not model middleware
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.currentReview = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); DOESNT work here, query has already executed
  await this.currentReview.constructor.calcAverageRatings(this.currentReview.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
