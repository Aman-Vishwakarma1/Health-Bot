const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const imagePath = path.join(__dirname, "..", "uploads");

// console.log(imagePath);

const fileStoreage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagePath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStoreage, fileFilter: fileFilter });

const { uploadImage } = require("../controllers/imageController");

router.post("/upload", upload.single("inputImage"), uploadImage);

module.exports = router;
