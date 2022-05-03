const express = require('express');

const router = express.Router();
const {
  getUsers,
  getProfile,
  updateProfile,
  getUser,
  updateUser,
  updateProfileImage,
  deleteUser,
  updateUserProfile,
} = require('../controllers/userController');
const { auth } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/uploadFIle');

// update own profile
router.use(auth());
router.route('/profile').get(getProfile).patch(updateUserProfile);
// router.patch('/user-profile', updateUserProfile);

router.patch('/image', uploadFile('image', 'users'), updateProfileImage);

// api/auth/..
router.get('/', auth('admin'), getUsers);
router.get('/:id', auth('admin'), getUser);
router.patch('/:id', auth('admin'), updateUser);
router.delete('/:id', auth('admin'), deleteUser);

module.exports = router;
