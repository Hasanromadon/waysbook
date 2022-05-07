const {
  book_reviews,
  books,
  categories,
  users,
  book_categories,
} = require('../../models');
const {
  handleErrorSever,
  handleErrorValidate,
} = require('../utils/handleError');
const cloudinary = require('../utils/cloudinary');

const Joi = require('joi');
const { Op, literal } = require('sequelize');
exports.getProducts = async (req, res) => {
  const { page, size } = req.pagination;

  let category = [];

  if (req.query.category) {
    category = req.query?.category.map((cat) => +cat);
  }

  try {
    let rawProductsData;

    if (category.length === 0) {
      rawProductsData = await books.findAndCountAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        where: {
          title: {
            [Op.like]: `%${req.query.title || ''}%`,
          },
          price: {
            [Op.and]: {
              [Op.gte]: req.query.minPrice || 0,
              [Op.lte]: req.query.maxPrice || 1000000000,
            },
          },
        },
        limit: size,
        offset: page * size,
        order: [['id', 'DESC']],
      });
    } else {
      rawProductsData = await books.findAndCountAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        where: {
          title: {
            [Op.like]: `%${req.query.title || ''}%`,
          },
          price: {
            [Op.and]: {
              [Op.gte]: req.query.minPrice || 0,
              [Op.lte]: req.query.maxPrice || 1000000000,
            },
          },
        },
        limit: size,
        offset: page * size,
        order: [['id', 'DESC']],
      });
    }

    let productsData = rawProductsData.rows.map((item) => {
      item.thumbnail = `${process.env.PATH_FILE}${item.thumbnail}`;
      item.bookAttachment = `${process.env.PATH_FILE}${item.bookAttachment}`;
      return item;
    });

    res.status(200).send({
      status: 'success',
      data: rawProductsData.rows,
      totalPages: Math.ceil(rawProductsData.count / Number.parseInt(size)),
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let productData = await books.findOne({
      where: {
        id,
      },
      // include: [
      //   {
      //     model: product_reviews,
      //     as: 'reviews',
      //     include: [
      //       {
      //         model: users,
      //         as: 'user',
      //         attributes: ['name'],
      //       },
      //     ],
      //     attributes: {
      //       exclude: ['updatedAt', 'id_user', 'id_product'],
      //     },
      //   },
      //   {
      //     model: categories,
      //     as: 'categories',
      //     attributes: ['id', 'name'],
      //     through: {
      //       model: product_categories,
      //       as: 'bridge',
      //       attributes: [],
      //     },
      //   },
      // ],
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    if (productData !== null) {
      productData.thumbnail = `${process.env.PATH_FILE}${productData.thumbnail}`;
      res.status(200).send({
        status: 'success',
        data: productData,
      });
    } else {
      res.status(404).send({
        status: 'success',
        message: 'book not found',
      });
    }
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.addProduct = async (req, res) => {
  try {
    let files = JSON.parse(JSON.stringify(req.files));
    const bookresult = await cloudinary.uploader.upload(files.image[0].path, {
      folder: 'waysbook_app',
      use_filename: true,
      unique_filename: false,
    });
    const data = req.body;
    const image = bookresult.public_id;
    data.thumbnail = image;

    const attachBookResult = await cloudinary.uploader.upload(
      files.bookAttachment[0].path,
      {
        folder: 'waysbook_app',
        use_filename: true,
        unique_filename: false,
      }
    );
    const attachment = attachBookResult.public_id;
    data.bookAttachment = attachment;

    //
    // if (req.body.categories) {
    //   req.body.categories = req.body.categories.split(',');
    // }
    // const schema = Joi.object({
    //   title: Joi.string().min(5).max(200).required(),
    //   desc: Joi.string().min(20).max(1200).required(),
    //   price: Joi.number().required(),
    //   qty: Joi.number().min(1).required(),
    //   thumbnail: Joi.string().required(),
    // });

    // const { error } = schema.validate(data);
    // if (error) return handleErrorValidate(error, res);

    const dataproduct = await books.create(data);

    // if (req.body && req.body.categories) {
    //   let categoriesRaw = req.body.categories.map((category) => ({
    //     id_product: dataproduct.id,
    //     id_category: parseInt(category),
    //   }));
    //   const categories = await product_categories.bulkCreate(categoriesRaw);
    //   dataproduct.categories = categories;
    // }

    res.status(200).send({
      status: 'success',
      data: dataproduct,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  let data = req.body;
  if (req.files) {
    let files = JSON.parse(JSON.stringify(req.files));
    if (files.image) {
      if (files?.image[0]?.path) {
        const bookresult = await cloudinary.uploader.upload(
          files.image[0].path,
          {
            folder: 'waysbook_app',
            use_filename: true,
            unique_filename: false,
          }
        );
        const image = bookresult.public_id;
        data.thumbnail = image;
      }
    }
    if (files?.bookAttachment) {
      if (files?.bookAttachment[0]?.path) {
        const attachBookResult = await cloudinary.uploader.upload(
          files.bookAttachment[0].path,
          {
            folder: 'waysbook_app',
            use_filename: true,
            unique_filename: false,
          }
        );
        const attachment = attachBookResult.public_id;
        data.bookAttachment = attachment;
      }
    }
  }

  // const schema = Joi.object({
  //   title: Joi.string().min(5).max(200),
  //   desc: Joi.string().min(5).max(1200),
  //   price: Joi.number(),
  //   image: Joi.string(),
  //   categories: Joi.array(),
  //   qty: Joi.number(),
  // });
  // const { error } = schema.validate(data);
  // if (error) return handleErrorValidate(error, res);

  try {
    await books.update(req.body, {
      where: {
        id,
      },
    });

    res.status(200).send({
      status: 'success',
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await books.destroy({
      where: {
        id,
      },
    });

    await product_categories.destroy({
      where: {
        id_product: id,
      },
    });

    res.status(200).json({
      status: `success delete product : ${id}`,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.addProductCategory = async (req, res) => {
  const { id } = req.params;
  let product = req.body;
  product.id_product = id;

  const schema = Joi.object({
    id_product: Joi.number().required(),
    id_category: Joi.number().required(),
  });
  const { error } = schema.validate(product);
  if (error) return handleErrorValidate(error, res);

  try {
    const data = await product_categories.create(product);

    res.status(200).send({
      status: 'success',
      data,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};
