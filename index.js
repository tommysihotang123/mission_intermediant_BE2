const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Serve folder upload agar gambar bisa diakses publik via URL browser
app.use('/upload', express.static('upload'));

// Routes
app.use('/upload', uploadRoutes); // Route upload gambar
app.use('/auth', authRoutes); // Gunakan route autentikasi untuk /auth
app.use('/', movieRoutes);

// Root route for simple check
app.get('/', (req, res) => {
    res.send('Movie App Backend API is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
