const express = require('express');
const ToursController = require('../controllers/toursController')

/********************************************* MIDDLEWARES *********************************************/
const router = express.Router();

router.param('id', ToursController.checkID)

const middleware = (req, res, next) => {
  console.log('request body is ', req.body);
  next();
}

router
  .route('/')
  .get(ToursController.getAllTours)
  .post(ToursController.checkBody, ToursController.createTour);

router
  .route('/:id')
  .get(ToursController.getTourById)
  .patch(ToursController.editTour)
  .delete(ToursController.deleteTour);


module.exports = router;