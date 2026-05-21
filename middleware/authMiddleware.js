const jwt = require('jsonwebtoken');

const SECRET_KEY = 'YOUR_SECRET_KEY_HERE'; // Harus sama dengan yang ada di authService.js

const authMiddleware = {
    verifyToken: (req, res, next) => {
        // 1. Ambil token dari header (Format biasanya: "Bearer <token>")
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ status: 'error', message: 'Akses ditolak. Token tidak ditemukan di header.' });
        }

        const token = authHeader.split(' ')[1]; // Mengambil token setelah kata "Bearer"

        if (!token) {
            return res.status(401).json({ status: 'error', message: 'Akses ditolak. Format token salah.' });
        }

        // 2. Verifikasi token
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            // 3. Jika valid, simpan data user ke request dan lanjut ke controller
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(403).json({ status: 'error', message: 'Autentikasi gagal. Token tidak valid atau sudah kadaluarsa.' });
        }
    }
};

module.exports = authMiddleware;
