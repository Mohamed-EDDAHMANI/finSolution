const fs = require("fs");
const multer = require("multer");
const path = require("path");

// مكان تخزين الصور
const uploadsDir = path.join(__dirname, "../uploads");
// Ensure uploads directory exists (bind mounts can hide image-created dirs)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // uploads folder inside project
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// فلترة الملفات (نقبل غير images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
