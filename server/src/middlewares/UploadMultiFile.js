const multer = require('multer');

exports.uploadMultiFile = (folder, method) => {
  // Destionation & rename file
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname.replace(/\s/g, ''));
    },
  });

  // Filter file extension
  const fileFilter = function (req, file, cb) {
    if (file.fieldname == 'image') {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = {
          message: 'Only image files are allowed!',
        };
        return cb(new Error('Only image files are allowed!', false));
      }
    } else if (file.fieldname == 'bookAttachment') {
      if (!file.originalname.match(/\.(pdf|PDF)$/)) {
        req.fileValidationError = {
          message: 'Only pdf files are allowed!',
        };
        return cb(new Error('Only pdf files are allowed!', false));
      }
    }
    cb(null, true);
  };

  // Maximum file size
  // MB -> KB -> byte
  const sizeInMB = 10;
  const maxSize = sizeInMB * 1000 * 1000;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: 'image',
      maxCount: 1,
    },
    {
      name: 'bookAttachment',
      maxCount: 1,
    },
  ]);

  // HANDLER required, if error, if LIMIT SIZE

  return (req, res, next) => {
    upload(req, res, function (err) {
      // if filter error
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }

      // if file doesn't provided

      if (method === 'patch' && !req.files) {
        return next();
      }

      if (!req.files && !err) {
        return res.status(400).send({
          messsage: 'Please select file to upload',
        });
      }

      // if exceed the max size
      if (err) {
        if (err.code == 'LIMIT_FILE_SIZE') {
          return res.status(400).send({
            messsage: 'Max file size 10Mb',
          });
        }
        return res.status(400).send(err);
      }

      // if all okay
      return next();
    });
  };
};
