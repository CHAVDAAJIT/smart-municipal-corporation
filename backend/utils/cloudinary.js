const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// ✅ Cloudinary configure karo
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Complaint photos storage
const complaintStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "smart-municipal/complaints",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
});

// ✅ Document/Certificate files storage
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "smart-municipal/documents",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto",
  },
});

// ✅ Profile photo storage
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "smart-municipal/profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 200, height: 200, crop: "fill" }],
  },
});

// ✅ Multer uploaders
exports.uploadComplaintPhotos = multer({
  storage: complaintStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).array("photos", 3);

exports.uploadDocumentFiles = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).array("documents", 5);

exports.uploadProfilePhoto = multer({
  storage: profileStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single("photo");

// ✅ Delete file from cloudinary
exports.deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.log("Cloudinary delete error:", err);
  }
};

exports.cloudinary = cloudinary;