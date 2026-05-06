const db = require('../database');

const movieService = {
    getAllMovies: async () => {
        const query = 'SELECT * FROM series_films';
        // db.query returns an array like [rows, fields]. We destructure to get rows.
        const [rows] = await db.query(query);
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
