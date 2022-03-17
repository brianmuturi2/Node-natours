const Tour = require('../models/TourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render template using tour data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // 1) Get the data for the requested tour (including reviews and tour guides)
  const tour = await Tour.findOne({slug: req.params.slug}).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  // 2) Build template

  // 3) Render template using data from 1
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour
  });
});
