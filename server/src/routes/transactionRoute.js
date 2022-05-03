const express = require('express');

const router = express.Router();
const {
  addTransaction,
  getTransactions,
  getTransaction,
  deleteTransaction,
  transactionReportCurrentMonth,
  transactionReportAll,
  transactionReportByMonth,
  notification,
  updateTransaction,
  reviewTransactions,
} = require('../controllers/transactionController');
const { auth } = require('../middlewares/auth');

router.post('/notification', notification);
router.use(auth());
router.route('/').get(getTransactions).post(addTransaction);
router.get(
  '/report/current-month',
  auth('admin'),
  transactionReportCurrentMonth
);
router.patch('/:id', auth(), updateTransaction);
router.get('/reviews/:id', auth(), reviewTransactions);
router.get('/report/all', auth('admin'), transactionReportAll);
router.get('/report/months', auth('admin'), transactionReportByMonth);
router.route('/:id').get(getTransaction);
router.delete('/:id', auth('admin'), deleteTransaction);

// review

module.exports = router;
