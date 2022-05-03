const { categories } = require('../../models');
const {
  handleErrorSever,
  handleErrorValidate,
} = require('../utils/handleError');
const Joi = require('joi');

// get all categories
exports.getCategories = async (req, res) => {
  try {
    const data = await categories.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      order: [['name', 'ASC']],
    });

    res.status(200).send({
      status: 'success',
      data,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

// get all category
exports.getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await categories.findOne({
      where: {
        id,
      },
    });
    if (data !== null) {
      res.status(200).send({
        status: 'success',
        data,
      });
    } else {
      res.status(404).send({
        status: 'success',
        message: 'category not found',
      });
    }
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};
exports.addCategory = async (req, res) => {
  // validate request data
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) handleErrorValidate(error);

  try {
    const data = await categories.create(req.body);

    res.status(200).send({
      status: 'success',
      data,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const schema = Joi.object({
    name: Joi.string().min(3),
  });

  const { error } = schema.validate(req.body);
  if (error) handleErrorValidate(error, res);

  try {
    await categories.update(req.body, {
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

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await categories.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: 'success',
      message: `success delete category : ${id}`,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};
