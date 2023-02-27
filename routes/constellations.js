import express from "express";
import multer from "multer";
import path from "path";
import {fileURLToPath} from 'url';
import connection from "../db.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB in bytes
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
            return cb(new Error("Only png and jpeg files are allowed"));
        }
        cb(null, true);
    }
});

const upload = multer({storage: storage});

router.get("/", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 7;
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) AS count FROM constellations`;
    const selectQuery = `SELECT * FROM constellations LIMIT ${limit} OFFSET ${offset}`;

    connection.query(countQuery, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({message: "An error occurred while retrieving the data"});
        } else {
            const totalItems = result[0].count;
            const totalPages = Math.ceil(totalItems / limit);
            connection.query(selectQuery, (err, selectResult) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({message: "An error occurred while retrieving the data"});
                } else {
                    res.status(200).json({
                        constellations: selectResult,
                        page: page,
                        totalPages: totalPages,
                        totalItems: totalItems
                    });
                }
            });
        }
    });
});
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT constellations.*, star_constellation.starId
        FROM constellations 
        LEFT JOIN star_constellation ON constellations.id = star_constellation.constellationId 
        WHERE constellations.id=?
    `;
    try {
        const [rows] = await connection.promise().query(query, [id]);
        if (rows.length === 0) {
            res.status(404).json({message: "Star not found"});
        } else {
            rows[0].starId = rows.map(row => row.starId).filter(id => id);
            const constellation = {
                ...rows[0]
            };
            res.status(200).json(constellation);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "An error occurred while retrieving the data"});
    }
});


router.post("/", upload.single("image"), async (req, res) => {
    const {name, article} = req.body || {};
    if (name === undefined || name.length === 0) {
        res.status(400).send({message: "Name is required"});
        return;
    }
    if (article === undefined || article.length === 0) {
        res.status(400).send({message: "Article is required"});
        return;
    }
    const file = req.file;
    if (file === undefined) {
        res.status(400).send({message: "Image is required"});
        return;
    }

    const query = `INSERT INTO constellations (name, article, imageUrl) VALUES ('${name}', '${article}', '${file.filename}')`;
    connection.query(query, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send({message: "An error occurred while inserting the data"});
        } else {
            res.status(200).json({
                message: "You have added a new constellation!"
            });
        }
    });
});


export default router;