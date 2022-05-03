const express = require('express');

const router = express.Router();
const {
  getReview,
  updateReview,
  addReview,
  getAllReviews,
  deleteReview,
} = require('../controllers/reviewController');
const { auth } = require('../middlewares/auth');

router.get('/', auth(), getAllReviews);
router.get('/:id', getReview);
router.post('/', auth(), addReview);
router.route('/:id').patch(auth(), updateReview).delete(auth(), deleteReview);

module.exports = router;
