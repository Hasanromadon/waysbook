exports.handleErrorValidate = (error, res) => {
  return res.status(400).json({
    error: {
      message: error.details[0].message,
    },
  });
};

exports.handleErrorSever = (res) => {
  return res.status(500).json({
    status: 'failed',
    message: 'Server Error',
  });
};
