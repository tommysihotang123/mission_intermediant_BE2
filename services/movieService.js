const db = require('../database');

const movieService = {
    getAllMovies: async (queryParams) => {
        let query = 'SELECT * FROM series_films';
        const conditions = [];
        const values = [];

        // 1. Search (Pencarian berdasarkan judul)
        if (queryParams.search) {
            conditions.push('title LIKE ?');
            values.push(`%${queryParams.search}%`);
        }

        // 2. Filter (Penyaringan berdasarkan tipe, misalnya: "Movie" atau "Series")
        if (queryParams.filter) {
            conditions.push('type = ?');
            values.push(queryParams.filter);
        }

        // Terapkan kondisi WHERE jika ada search atau filter
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        // 3. Sort (Pengurutan data)
        if (queryParams.sort) {
            // Contoh sort: release_date, rating, dll
            // Kita asumsikan default pengurutannya ASC, tapi bisa juga diatur jadi DESC
            const sortField = queryParams.sort;
            const sortOrder = queryParams.order && queryParams.order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
            
            // Validasi nama kolom untuk mencegah SQL Injection pada ORDER BY
            const allowedSortFields = ['id', 'title', 'release_date', 'type', 'age_rating'];
            if (allowedSortFields.includes(sortField)) {
                query += ` ORDER BY ${sortField} ${sortOrder}`;
            }
        }

        const [rows] = await db.query(query, values);
        return rows;
    },

    getMovieById: async (id) => {
        const query = 'SELECT * FROM series_films WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0]; // Return the first object since id is unique
    },

    addMovie: async (data) => {
        const { title, description, type, release_date, age_rating, poster_url, backdrop_url } = data;
        const query = `
            INSERT INTO series_films (title, description, type, release_date, age_rating, poster_url, backdrop_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [title, description, type, release_date, age_rating, poster_url, backdrop_url]);
        
        // MySQL returns insertId instead of lastID
        return { id: result.insertId, ...data };
    },

    updateMovie: async (id, data) => {
        const fields = [];
        const values = [];
        
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            return { message: 'No fields to update', changes: 0 };
        }

        values.push(id); // for the WHERE clause
        const query = `UPDATE series_films SET ${fields.join(', ')} WHERE id = ?`;
        
        const [result] = await db.query(query, values);
        
        // MySQL returns affectedRows instead of changes
        return { changes: result.affectedRows, id, ...data };
    },

    deleteMovie: async (id) => {
        const query = 'DELETE FROM series_films WHERE id = ?';
        const [result] = await db.query(query, [id]);
        return { changes: result.affectedRows, message: 'Movie deleted successfully' };
    }
};

module.exports = movieService;
