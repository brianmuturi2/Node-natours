const express = require('express');
const ToursController = require('../controllers/toursController')

/********************************************* MIDDLEWARES *********************************************/
const router = express.Router();

/*router.param('id', ToursController.checkID)*/

router
  .route('/top-5-tours')
  .get(ToursController.aliasTopTours, ToursController.getAllTours);

router
  .route('/')
  .get(ToursController.getAllTours)
  .post(ToursController.createTour);

router
  .route('/:id')
  .get(ToursController.getTourById)
  .patch(ToursController.editTour)
  .delete(ToursController.deleteTour);


module.exports = router;
