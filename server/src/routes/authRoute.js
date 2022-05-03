const express = require('express');

const router = express.Router();
const {
  register,
  login,
  changePassword,
  deleteOWnUser,
  checkAuth,
} = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

// api/auth/..
router.post('/register', register);
router.post('/login', login);
router.patch('/check-auth', auth(), checkAuth);
router.patch('/password', auth(), changePassword);
router.delete('/user', auth(), deleteOWnUser);

// router.get('/isauth', auth(), authController.isauth);

module.exports = router;
