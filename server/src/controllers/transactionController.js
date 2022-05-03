const {
  transactions,
  transaction_details,
  books,
  users,
  profiles,
} = require('../../models');
const { generateInvoiceNumber } = require('../utils/generateInvoiceNumber');
const midtransClient = require('midtrans-client');
const {
  handleErrorSever,
  handleErrorValidate,
} = require('../utils/handleError');
const Joi = require('joi');
const { Op, literal, fn, col } = require('sequelize');
const { date } = require('joi');
const { generateDateRangeMonth } = require('../utils/generateDateRangeMonth');
const convertRupiah = require('rupiah-format');
const nodemailer = require('nodemailer');
exports.getTransactions = async (req, res) => {
  const { role, id } = req.user;

  try {
    let transactionsData;
    if (role === 'admin') {
      transactionsData = await transactions.findAll({
        attributes: {
          exclude: ['updatedAt'],
        },
        include: [
          {
            model: transaction_details,
            as: 'order_detail',
            include: [
              {
                model: books,
                as: 'book_detail',
                attributes: ['id', 'title', 'thumbnail'],
              },
            ],
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'id_order', 'id'],
            },
          },
          {
            model: users,
            as: 'buyer',
            attributes: ['id', 'fullname'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.send({
        status: 'success',
        data: transactionsData,
      });
    } else {
      transactionsData = await transactions.findAll({
        where: {
          id_buyer: id,
          status: 'success',
        },
        attributes: {
          exclude: ['password', 'updatedAt'],
        },
        include: {
          model: transaction_details,
          as: 'order_detail',
          include: [
            {
              model: books,
              as: 'book_detail',
              attributes: [
                'id',
                'title',
                'author',
                'thumbnail',
                'bookAttachment',
              ],
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id_order', 'id', 'id_product'],
          },
        },
        order: [['createdAt', 'DESC']],
      });

      transactionsData = JSON.parse(JSON.stringify(transactionsData));
      // transactionsData = transactionsData.map((transaction) => {
      //   return transaction?.order_detail.map(
      //     (book) =>
      //       (book.book_detail.thumbanail =
      //         process.env.PATH_FILE + book.book_detail.thumbnail)
      //   );
      // });

      // transactionsData = transactionsData.map((transaction) => ({
      //   ...transaction,
      //   transaction.order_detail.map((book) => {
      //     book.book_detail.thumbnail =
      //       process.env.PATH_FILE + book.book_detail.thumbnail;
      //   });
      // }));

      transactionsData = transactionsData.map((transaction) => ({
        ...transaction,
        order_detail: transaction.order_detail.map((book) => ({
          ...book,
          book_detail: {
            ...book.book_detail,
            thumbnail: process.env.PATH_FILE + book.book_detail.thumbnail,
          },
        })),
      }));

      console.log(transactionsData);
      res.send({
        status: 'success',
        data: transactionsData,
      });
    }
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.getTransaction = async (req, res) => {
  const { role, id } = req.user;
  const transactionId = req.params.id;
  try {
    let transactionData;
    if (role === 'admin') {
      transactionData = await transactions.findOne({
        where: {
          id: transactionId,
        },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
        include: {
          model: transaction_details,
          as: 'order_detail',
          include: [
            {
              model: products,
              as: 'product_detail',
              attributes: ['name'],
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id_order', 'id', 'id_product'],
          },
        },
      });
    } else {
      transactionData = await transactions.findOne({
        where: {
          id: transactionId,
          id_buyer: id,
        },
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
        include: {
          model: transaction_details,
          as: 'order_detail',
          include: [
            {
              model: products,
              as: 'product_detail',
              attributes: ['fullname'],
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'id_order', 'id', 'id_product'],
          },
        },
      });
    }
    if (transactionData !== null) {
      res.send({
        status: 'success',
        data: transactionData,
      });
    } else {
      res.status(404).send({
        status: 'success',
        message: 'transaction not found',
      });
    }
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.addTransaction = async (req, res) => {
  const id = req.user.id;
  const data = req.body;

  try {
    // const lastID =
    //   (await transactions.findOne({
    //     limit: 1,
    //     order: [['id', 'DESC']],
    //     attributes: ['id'],
    //   })) || 0;
    const invoice_number = generateInvoiceNumber();
    const idTransaction = parseInt(Math.random().toString().slice(3, 8));

    const dataTransaction = await transactions.create({
      id: idTransaction,
      id_buyer: id,
      status: 'pending',
    });

    const orderDetail = data.order_detail.map((item) => ({
      ...item,
      id_order: dataTransaction.id,
      status: 'pending',
    }));

    await transaction_details.bulkCreate(orderDetail);

    const grossAmount = data.total;

    let buyerData = await users.findOne({
      where: {
        id,
      },
      include: {
        model: profiles,
        as: 'profile',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id_user'],
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    let snap = new midtransClient.Snap({
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
      isProduction: false,
    });

    let parameter = {
      transaction_details: {
        order_id: dataTransaction.id,
        gross_amount: grossAmount,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        full_name: buyerData?.name,
        email: buyerData?.email,
        phone: buyerData?.profile?.phone,
      },
    };
    const payment = await snap.createTransaction(parameter);

    res.send({
      status: 'pending',
      message: 'Pending transaction payment gateway',
      payment,
      product: {
        id: 2,
      },
    });

    // const data_order_detail = order_detail.map((order) => {
    //   return {
    //     ...order,
    //     id_order: dataTransaction.id,
    //   };
    // });

    // await transaction_details.bulkCreate(data_order_detail);
    // update stock
    // order_detail.map(async (order) => {
    //   await products.increment(
    //     {
    //       qty: -order.qty,
    //     },
    //     {
    //       where: {
    //         id: order.id_product,
    //       },
    //     }
    //   );
    // });

    // res.send({
    //   status: 'success',
    //   data: dataTransaction,
    // });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

const core = new midtransClient.CoreApi();

core.apiConfig.set({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

exports.notification = async (req, res) => {
  try {
    console.log('-------------- NOtification ✅  --------------');
    const statusResponse = await core.transaction.notification(req.body);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        // TODO set transaction status on your database to 'challenge'
        // and response with 200 OK
        sendEmail('pending', orderId); //sendEmail with status pending and order id
        handleTransaction('pending', orderId);
        res.status(200);
      } else if (fraudStatus == 'accept') {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        sendEmail('success', orderId); //sendEmail with status success and order id
        handleTransaction('success', orderId);
        res.status(200);
      }
    } else if (transactionStatus == 'settlement') {
      // TODO set transaction status on your database to 'success'
      // and response with 200 OK
      sendEmail('success', orderId); //sendEmail with status success and order id
      handleTransaction('success', orderId);
      res.status(200);
    } else if (
      transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire'
    ) {
      // TODO set transaction status on your database to 'failure'
      // and response with 200 OK
      sendEmail('failed', orderId); //sendEmail with status failed and order id
      handleTransaction('failed', orderId);
      res.status(200);
    } else if (transactionStatus == 'pending') {
      // TODO set transaction status on your database to 'pending' / waiting payment
      // and response with 200 OK
      sendEmail('pending', orderId); //sendEmail with status pending and order id
      handleTransaction('pending', orderId);
      res.status(200);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

// const updateProduct = async (orderId) => {
//   const data = await transaction_details.findAll({
//     where: {
//       id_order: +orderId,
//     },
//   });
//   let rawTransactionData = JSON.parse(JSON.stringify(data));

//   rawTransactionData.map(async (order) => {
//     await products.increment(
//       {
//         qty: -order.qty,
//       },
//       {
//         where: {
//           id: +order.id_product,
//         },
//       }
//     );
//   });
// };

const handleTransaction = async (status, transactionId) => {
  await transactions.update(
    {
      status,
    },
    {
      where: {
        id: transactionId,
      },
    }
  );
  await transaction_details.update(
    {
      status,
    },
    {
      where: {
        id_order: transactionId,
      },
    }
  );
};

exports.updateTransaction = async (req, res) => {
  const id = req.params.id;
  try {
    await transactions.update(req.body, {
      where: {
        id,
      },
    });

    res.status(200).send({
      status: 'success',
      message: `updated tracking_number id_order : ${id}`,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.deleteTransaction = async (req, res) => {
  const id = req.params.id;
  try {
    await transactions.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: 'success',
      message: `deleted transaction id: ${id}`,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.transactionReportCurrentMonth = async (req, res) => {
  try {
    const currentMonth = generateDateRangeMonth();

    const records = await transaction_details.findAll({
      where: {
        createdAt: {
          [Op.and]: {
            [Op.gt]: currentMonth.startedDate,
            [Op.lte]: currentMonth.endDate,
          },
        },
      },
      attributes: [[literal('SUM(qty * price)'), 'total_revenue']],
    });

    res.status(200).json({
      status: 'success',
      message: 'revenue current month',
      data: records,
    });
  } catch (error) {
    handleErrorSever(res);
  }
};
exports.transactionReportAll = async (req, res) => {
  try {
    const records = await transaction_details.findAll({
      attributes: [[literal('SUM(qty * price)'), 'Total']],
    });

    res.status(200).json({
      status: 'success',
      message: 'revenue current all the time',
      data: records,
    });
  } catch (error) {
    handleErrorSever(res);
  }
};
exports.transactionReportByMonth = async (req, res) => {
  try {
    const records = await transaction_details.findAll({
      attributes: [
        [literal('extract(MONTH from "createdAt"::timestamp)'), 'month'],
        [literal('SUM(qty * price)'), 'total'],
      ],
      group: 'month',
    });
    // [fn('MONTH', col('createdAt')), 'month'],
    res.status(200).json({
      status: 'success',
      data: records,
    });
  } catch (error) {
    handleErrorSever(res);
  }
};

const sendEmail = async (status, transactionId) => {
  // Config service and email account
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SYSTEM_EMAIL,
      pass: process.env.SYSTEM_PASSWORD,
    },
  });

  // Get transaction data
  let data = await transactions.findOne({
    where: {
      id: transactionId,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'password'],
    },
    include: [
      {
        model: users,
        as: 'buyer',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'password', 'status'],
        },
      },
    ],
  });

  data = JSON.parse(JSON.stringify(data));

  // Email options content
  const mailOptions = {
    from: process.env.SYSTEM_EMAIL,
    to: data.buyer.email,
    subject: 'Notification Order',
    text: 'Your payment is <br />' + status,
    html: `<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Document</title>
                <style>
                  h1 {
                    color: brown;
                  }
                </style>
              </head>
              <body>
                <h2>Thank you for transaction</h2>
              </body>
            </html>`,
  };

  // Send an email if there is a change in the transaction status
  if (data.status != status) {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw err;
      console.log('Email sent: ' + info.response);

      return res.send({
        status: 'Success',
        message: info.response,
      });
    });
  }
};

exports.reviewTransactions = async (req, res) => {
  const { id } = req.user;
  const id_order = req.params.id;

  try {
    const productReview = await transactions.findAll({
      where: {
        id: id_order,
        id_buyer: id,
      },
      include: [
        {
          model: transaction_details,
          as: 'order_detail',
          include: [
            {
              model: products,
              as: 'product_detail',
              attributes: ['id', 'name', 'image'],
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    });
    res.status(200).send({
      status: 'success',
      data: productReview,
    });
  } catch (error) {
    handleErrorSever(res);
  }
};
