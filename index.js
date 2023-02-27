import express from 'express';
import {createStarsTable, createStarConstellationTable, createConstellationsTable} from "./seeder.js";
import connection from "./db.js";
import starsRouter from "./routes/stars.js";
import path from "path";
import {fileURLToPath} from "url";

const app = express();
const PORT = 5200;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//It's used to display images, so we need to make the uploads folder public
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Routes
app.use('/stars', starsRouter);


//Seeder only in dev
app.get('/seed', (req, res) => {
    connection.query(createConstellationsTable, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({message: 'Database not seeded!'});
        } else {
            connection.query(createStarsTable, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({message: 'Database not seeded!'});
                } else {
                    connection.query(createStarConstellationTable, (err, result) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({message: 'Database not seeded!'});
                        } else {
                            res.status(200).json({message: 'Database seeded!'});
                        }
                    });
                }
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});