const jwt = require('jsonwebtoken');

exports.auth = function (...role) {
  return async (req, res, next) => {
    try {
      const authHeader = req.header('Authorization');

      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).send({
          message: 'Access denied!',
        });
      }
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      if (role.length === 0) {
        req.user = verified;

        next();
      } else {
        if (role[0] === verified.role) {
          req.user = verified;
          next();
        } else {
          res.status(401).send({ message: 'Access denied!' });
        }
      }
    } catch (error) {
      res.status(400).send({ message: 'Access denied!' });
    }
  };
};
