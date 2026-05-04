const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs/promises");
const path = require("path");
const AppError = require("../utils/AppError");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new AppError("Only image files are allowed", 400));
    }
    return cb(null, true);
  },
});

const uploadBookingImage = upload.single("image");

const processBookingImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const uploadsRoot = path.join(__dirname, "../../uploads/bookings");
    await fs.mkdir(uploadsRoot, { recursive: true });

    const imageFileName = `booking-${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`;
    const filePath = path.join(uploadsRoot, imageFileName);

    await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 1280, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(filePath);

    req.body.vehicleImageUrl = `/uploads/bookings/${imageFileName}`;
    return next();
  } catch (error) {
    return next(new AppError("Failed to process image", 500));
  }
};

module.exports = {
  uploadBookingImage,
  processBookingImage,
};