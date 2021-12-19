const express = require('express');
const {getAllUsers, createUser, getUser, editUser, deleteUser} = require('../controllers/usersController')

const router = express.Router();

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(editUser)
  .delete(deleteUser);

module.exports = router;