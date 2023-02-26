import express from 'express';
import connection from "./db.js";
import {createTableUsersQuery} from "./seeder.js";
import usersRouter from "./routes/users.js";

const app = express();
const PORT = 5200;

//Routes
app.use('/users', usersRouter);

//Seeder only in dev
app.get('/seed', (req, res) => {

    connection.query(createTableUsersQuery, (err, result) => {
        if (err) throw err;
        console.log('User table created successfully');
    });
    res.send('User table created successfully');
});

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});