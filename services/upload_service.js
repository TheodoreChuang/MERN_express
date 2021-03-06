const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

// configure the keys for accessing AWS
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

// create S3 instance
const s3 = new aws.S3();

// configure multer middleware
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    // Allows multer-s3 to automatically determine the content type, is now able to cater to videos
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

//// Uploads image file to S3 bucket, file from form with key 'image'
// @returns req.image_url: S3 url
function avatarUpload(req, res, next) {
  const singleUpload = upload.single("image");
  singleUpload(req, res, error => {
    if (error) {
      return next(new HTTPError(422, `Image Upload Error: ${error.message}`));
    }
    if (!req.file) {
      return next(new HTTPError(422, "No image file was selected"));
    }
    req.body.image_url = req.file.location;
    next();
  });
}

//// Upload video to s3. Once video is uploaded, the video url is stored to "video_url"
// @returns req.body.video_url: S3 url
function videoUpload(req, res, next) {
  const singleUpload = upload.single("video");
  singleUpload(req, res, error => {
    if (error) {
      return next(new HTTPError(422, `Video Upload Error: ${error.message}`));
    }
    if (!req.file) {
      return next(new HTTPError(422, "No video file was selected"));
    }
    req.body.video_url = req.file.location;
    next();
  });
}

module.exports = {
  avatarUpload,
  videoUpload
};
