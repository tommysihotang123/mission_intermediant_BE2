const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../database'); // Panggil koneksi XAMPP

// Endpoint POST /upload (Wajib Login karena pakai authMiddleware)
router.post('/', authMiddleware.verifyToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'Tolong pilih file gambar untuk diunggah!' });
        }

        const imagePath = `/upload/${req.file.filename}`;

        // BUKTI KE XAMPP: Menyimpan URL gambar ke kolom profile_picture milik user yang sedang login
        const userId = req.user.id;
        await db.query('UPDATE users SET profile_picture = ? WHERE id = ?', [imagePath, userId]);

        // Memberikan respon sukses
        res.status(200).json({
            status: 'success',
            message: 'Gambar berhasil diunggah dan tersimpan di database XAMPP!',
            data: {
                filename: req.file.filename,
                path: imagePath
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
