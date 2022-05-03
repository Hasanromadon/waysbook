const express = require('express');
const router = express.Router();

const authRoute = require('../routes/authRoute');
const userRoute = require('../routes/userRoute');
const categoryRoute = require('../routes/categoryRoute');
const productRoute = require('../routes/productRoute');
const transactionRoute = require('../routes/transactionRoute');
const reviewRoute = require('../routes/reviewRoute');

const routeIndex = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  // {
  //   path: '/categories',
  //   route: categoryRoute,
  // },
  {
    path: '/books',
    route: productRoute,
  },
  {
    path: '/transactions',
    route: transactionRoute,
  },
  // {
  //   path: '/reviews',
  //   route: reviewRoute,
  // },
];

routeIndex.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
