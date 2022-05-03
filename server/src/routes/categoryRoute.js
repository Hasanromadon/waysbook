const express = require('express');

const router = express.Router();
const {
  getCategories,
  getCategory,
  deleteCategory,
  updateCategory,
  addCategory,
} = require('../controllers/categoryController');
const { auth } = require('../middlewares/auth');

router.get('/', getCategories);
router.get('/:id', getCategory);

router.use(auth('admin'));
router.post('/', addCategory);
router.route('/:id').patch(updateCategory).delete(deleteCategory);

module.exports = router;
