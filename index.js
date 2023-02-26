import express from 'express';
import connection from "./db.js";

const app = express();
const PORT = 5200;

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results, fields) => {
        if (err) throw err;
        console.log('User data:', results);
    });
    res.send('GET /users');
});

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});