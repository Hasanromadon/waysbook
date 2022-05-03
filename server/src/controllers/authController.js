const { users, profiles } = require('../../models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');
const {
  handleErrorValidate,
  handleErrorSever,
} = require('../utils/handleError');
exports.register = async (req, res) => {
  const data = req.body;

  // validate request data
  const schema = Joi.object({
    fullname: Joi.string().min(5).required(),
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(data);

  if (error) return handleErrorValidate(error, res);

  // check email
  const userEmail = await users.findOne({
    where: {
      email: data.email,
    },
  });

  if (userEmail) {
    return res.status(400).send({
      error: {
        message: 'email already exist',
      },
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    // we hash password from request with salt
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newUser = await users.create({
      fullname: data.fullname,
      email: data.email,
      password: hashedPassword,
    });

    // add profile

    await profiles.create({
      id_user: newUser.id,
    });

    // generate token
    const token = generateToken(newUser.id);

    res.status(200).send({
      status: 'success',
      data: {
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

// login
exports.login = async (req, res) => {
  // our validation schema here
  const schema = Joi.object({
    email: Joi.string().email().min(6).required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);

  // if error exist send validation error message
  if (error) return handleErrorValidate(error, res);

  try {
    const userExist = await users.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });

    const isValid = await bcrypt.compare(req.body.password, userExist.password);

    // check if not valid then return response with status 400 (bad request)
    if (!isValid) {
      return res.status(400).json({
        status: 'failed',
        message: 'credential is invalid',
      });
    }

    const token = generateToken({
      id: userExist.id,
      name: userExist.name,
      email: userExist.email,
      role: userExist.role,
    });

    res.status(200).send({
      status: 'success...',
      data: {
        name: userExist.name,
        email: userExist.email,
        role: userExist.role,
        token,
      },
    });
  } catch (error) {
    return handleErrorSever(res);
  }
};

exports.changePassword = async (req, res) => {
  const { id } = req.user;

  const schema = Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string()
      .min(6)
      .disallow(Joi.ref('oldPassword'))
      .required(),
  });

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  if (error) return handleErrorValidate(error, res);

  try {
    const existUser = await users.findOne({
      where: {
        id,
      },
      attributes: ['password'],
    });

    const isValid = await bcrypt.compare(
      req.body.oldPassword,
      existUser.password
    );

    // check if not valid then return response with status 400 (bad request)
    if (!isValid) {
      return res.status(400).send({
        status: 'failed',
        message: 'old password not match',
      });
    }

    const salt = await bcrypt.genSalt(10);
    // we hash password from request with salt
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    await users.update(
      { password: hashedPassword },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send({
      status: 'success...',
      message: 'password updated',
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.deleteOWnUser = async (req, res) => {
  const { id } = req.user;

  try {
    await users.destroy({
      where: {
        id,
      },
    });

    res.status(204).send({
      status: 'success',
      message: 'account deleted',
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password'],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: 'failed',
      });
    }

    res.send({
      status: 'success...',
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.name,
          email: dataUser.email,
          status: dataUser.role,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status({
      status: 'failed',
      message: 'Server Error',
    });
  }
};
