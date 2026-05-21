const express = require('express');
const router = express.Router();
const movieService = require('../services/movieService');
const authMiddleware = require('../middleware/authMiddleware');

// 1. GET /movies - List semua movies (Dilindungi oleh authMiddleware)
router.get('/movies', authMiddleware.verifyToken, async (req, res) => {
    try {
        // req.query dikirimkan ke service untuk fitur Search, Filter, Sort
        const movies = await movieService.getAllMovies(req.query);
        res.status(200).json({
            status: 'success',
            data: movies
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// 2. GET /movie/:id - Menampilkan satu movie berdasarkan id
router.get('/movie/:id', authMiddleware.verifyToken, async (req, res) => {
    try {
        const movie = await movieService.getMovieById(req.params.id);
        if (!movie) {
            return res.status(404).json({ status: 'error', message: 'Movie not found' });
        }
        res.status(200).json({
            status: 'success',
            data: movie
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// 3. POST /movie - Menambahkan data movie
router.post('/movie', authMiddleware.verifyToken, async (req, res) => {
    try {
        const newMovie = await movieService.addMovie(req.body);
        res.status(201).json({
            status: 'success',
            message: 'Movie added successfully',
            data: newMovie
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// 4. PUT/PATCH /movie/:id - Mengubah data berdasarkan id
router.patch('/movie/:id', authMiddleware.verifyToken, async (req, res) => {
    try {
        const updatedMovie = await movieService.updateMovie(req.params.id, req.body);
        if (updatedMovie.changes === 0) {
            return res.status(404).json({ status: 'error', message: 'Movie not found or no changes made' });
        }
        res.status(200).json({
            status: 'success',
            message: 'Movie updated successfully',
            data: updatedMovie
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
// Using PUT mapped to the same PATCH logic as per standard update practices, though PATCH is specified for partial updates.
router.put('/movie/:id', authMiddleware.verifyToken, async (req, res) => {
    try {
        const updatedMovie = await movieService.updateMovie(req.params.id, req.body);
        if (updatedMovie.changes === 0) {
            return res.status(404).json({ status: 'error', message: 'Movie not found or no changes made' });
        }
        res.status(200).json({
            status: 'success',
            message: 'Movie updated successfully',
            data: updatedMovie
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});


// 5. DELETE /movie/:id - Menghapus data berdasarkan id
router.delete('/movie/:id', authMiddleware.verifyToken, async (req, res) => {
    try {
        const result = await movieService.deleteMovie(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ status: 'error', message: 'Movie not found' });
        }
        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
