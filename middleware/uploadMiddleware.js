const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan (Storage)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Folder tujuan penyimpanan file
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        // Membuat nama file unik dengan menambahkan timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Filter untuk memastikan hanya file gambar yang bisa diunggah
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung. Hanya izinkan JPEG, JPG, atau PNG!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Maksimal 5MB
    }
});

module.exports = upload;
