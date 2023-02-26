import express from 'express';
import {createStarsTable} from "./seeder.js";
import connection from "./db.js";
import starsRouter from "./routes/stars.js";

const app = express();
const PORT = 5200;

//Routes
app.use('/stars', starsRouter);


//Seeder only in dev
app.get('/seed', (req, res) => {
    connection.query(createStarsTable, (err, result) => {
        if (err) {
            res.status(500).send({message: 'Database not seeded!'});
        } else {
            res.status(200).json({message: 'Database seeded!'});
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});