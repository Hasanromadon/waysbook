const express = require('express');

const router = express.Router();
const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  addProductCategory,
} = require('../controllers/productController');
const { auth } = require('../middlewares/auth');
const { pagination } = require('../middlewares/paginationRequest');
const { uploadFile } = require('../middlewares/uploadFIle');
const { uploadMultiFile } = require('../middlewares/UploadMultiFile');

router
  .route('/')
  .get(pagination, getProducts)
  .post(auth('admin'), uploadMultiFile('file', null), addProduct);
router
  .route('/:id')
  .get(getProduct)
  .patch(auth('admin'), uploadMultiFile('file', null), updateProduct)
  .delete(auth('admin'), deleteProduct);
router.route('/:id/category').post(auth('admin'), addProductCategory);

module.exports = router;
