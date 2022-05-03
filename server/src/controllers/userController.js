const cloudinary = require('../utils/cloudinary');
const { users, profiles } = require('../../models');
const {
  handleErrorSever,
  handleErrorValidate,
} = require('../utils/handleError');
const Joi = require('joi');

// get all users
exports.getUsers = async (req, res) => {
  try {
    let usersData = await users.findAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
      include: {
        model: profiles,
        as: 'profile',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id_user'],
        },
      },
      order: [['id', 'DESC']],
    });
    usersData = usersData.map((user) => {
      if (user.profile !== null) {
        user.profile.image = `${process.env.PATH_FILE}${user.profile.image}`;
      }
      return user;
    });
    res.send({
      status: 'success',
      data: usersData,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

// get all users
exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    let userdata = await users.findOne({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
      include: {
        model: profiles,
        as: 'profile',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id_user'],
        },
      },
      where: {
        id,
      },
      order: [['id', 'DESC']],
    });

    if (userdata !== null) {
      if (userdata.profile.image != null) {
        userdata.profile.image = `${process.env.PATH_FILE}${userdata.profile.image}`;
      }
      res.status(200).send({
        status: 'success',
        data: userdata,
      });
    } else {
      res.status(404).send({
        status: 'success',
        data: 'user not found',
      });
    }
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await users.update(req.body, {
      where: {
        id,
      },
    });

    res.send({
      status: 'success',
      message: 'user updated',
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await users.destroy({
      where: {
        id,
      },
    });

    res.status(200).send({
      status: 'success',
      message: `deleted user id: ${id}`,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

// GET OWN PROFILE
exports.getProfile = async (req, res) => {
  const { id } = req.user;

  try {
    let user = await users.findOne({
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
    if (user.profile.image !== null) {
      user.profile.image = `${process.env.PATH_FILE}${user.profile.image}`;
    }

    res.status(200).send({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.updateProfile = async (req, res) => {
  const { id } = req.user;

  const schema = Joi.object({
    phone: Joi.number(),
    gender: Joi.any().valid('male', 'female'),
    address: Joi.string().min(30),
  });
  const { error } = schema.validate(req.body);
  if (error) return handleErrorValidate(error, res);

  try {
    await profiles.update(req.body, {
      where: {
        id_user: id,
      },
    });

    res.send({
      status: 'success',
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

exports.updateProfileImage = async (req, res) => {
  const { id } = req.user;
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'waysbook_app',
    use_filename: true,
    unique_filename: false,
  });

  const image = result.public_id;

  try {
    await profiles.update(
      {
        image,
      },
      {
        where: {
          id_user: id,
        },
      }
    );

    res.status(200).send({
      status: 'success',
      message: 'image profile updated',
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};

// // add PROFILE
// exports.addProfile = async (req, res) => {
//   const { id } = req.user;
//   let profile = req.body;
//   profile.id_user = id;

//   const schema = Joi.object({
//     id_user: Joi.number().required(),
//     phone: Joi.number(),
//     gender: Joi.any().valid('male', 'female'),
//     address: Joi.string().min(50),
//   });
//   const { error } = schema.validate(profile);
//   if (error) return handleErrorValidate(error, res);

//   try {
//     const data = await profiles.create(profile);

//     res.send({
//       status: 'success',
//       data,
//     });
//   } catch (error) {
//     errorHandler(res);
//   }
// };

exports.updateUserProfile = async (req, res) => {
  const { id } = req.user;
  req.body && req.body.id && delete req.body.id;
  req.body && req.body.password && delete req.body.password;

  try {
    await users.update(req.body, {
      where: {
        id,
      },
    });
    await profiles.update(req.body, {
      where: {
        id_user: id,
      },
    });

    let user = await users.findOne({
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
    user.profile.image = `${process.env.PATH_FILE}${user.profile.image}`;
    res.status(200).send({
      status: 'success',
      data: user,
    });
  } catch (error) {
    console.log(error);
    handleErrorSever(res);
  }
};
