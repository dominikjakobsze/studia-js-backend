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

    const countQuery = `SELECT COUNT(*) AS count FROM stars`;
    const selectQuery = `SELECT * FROM stars LIMIT ${limit} OFFSET ${offset}`;

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
                        stars: selectResult,
                        page: page,
                        totalPages: totalPages,
                        totalItems: totalItems
                    });
                }
            });
        }
    });
});
router.get("/:id", (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT stars.*, star_constellation.constellationId as '@constellationId'
        FROM stars 
        LEFT JOIN star_constellation ON stars.id = star_constellation.starId 
        WHERE stars.id=${id}
    `;
    connection.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({message: "An error occurred while retrieving the data"});
        } else if (result.length === 0) {
            res.status(404).json({message: "Star not found"});
        } else {
            res.status(200).json(result[0]);
        }
    });
});


router.post("/", upload.single("image"), async (req, res) => {
    const {name, article} = req.body || {};
    if (name === undefined || name.length === 0) {
        res.status(400).send({message: "Name is required"});
    }
    if (article === undefined || article.length === 0) {
        res.status(400).send({message: "Article is required"});
    }
    const file = req.file;
    if (file === undefined) {
        res.status(400).send({message: "Image is required"});
    }

    const query = `INSERT INTO stars (name, article, imageUrl) VALUES ('${name}', '${article}', '${file.filename}')`;
    connection.query(query, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send({message: "An error occurred while inserting the data"});
        } else {
            res.status(200).json({
                message: "You have added a new star!"
            });
        }
    });
});

router.patch("/:id", upload.single("image"), async (req, res) => {
    const {name, article, shine, constellationId, turned} = req.body || {};
    const file = req.file;

    let checker = false;
    const setClause = [];

    if (name) {
        setClause.push(`name = '${name}'`);
    }
    if (article) {
        setClause.push(`article = '${article}'`);
    }
    if (shine) {
        setClause.push(`shine = ${shine}`);
    }
    if (turned) {
        setClause.push(`turned = ${turned}`);
    }
    if (file) {
        setClause.push(`imageUrl = '${file.filename}'`);
    }

    if (constellationId) {
        const checkConstellationQuery = `SELECT * FROM constellations WHERE id=${constellationId}`;
        connection.query(checkConstellationQuery, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send({message: "An error occurred while checking for the constellation"});
            } else if (result.length === 0) {
                res.status(400).send({message: "Constellation does not exist"});
            } else {
                const checkStarQuery = `SELECT * FROM stars WHERE id=${req.params.id}`;
                connection.query(checkStarQuery, (err, result) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send({message: "An error occurred while checking for the star"});
                    } else if (result.length === 0) {
                        res.status(400).send({message: "Star does not exist"});
                    } else {
                        const query = `SELECT * FROM star_constellation WHERE starId=${req.params.id} AND constellationId=${constellationId}`;
                        connection.query(query, (err, result) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send({message: "An error occurred while checking for existing record"});
                            } else if (result.length > 0) {
                                res.status(400).send({message: "Star is already assigned to this constellation"});
                            } else {
                                const insertQuery = `INSERT INTO star_constellation (starId, constellationId) VALUES (${req.params.id}, ${constellationId})`;
                                connection.query(insertQuery, (err) => {
                                    if (err) {
                                        console.error(err);
                                        res.status(500).send({message: "An error occurred while inserting the data"});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
        checker = true;
    }


    if (checker === false && setClause.length === 0) {
        res.status(400).send({message: "No fields to update"});
    } else if (checker === true && setClause.length === 0) {
        res.status(200).json({
            message: `Star was updated successfully!`
        });
    } else {
        const query = `UPDATE stars SET ${setClause.join(", ")} WHERE id = ${req.params.id}`;
        connection.query(query, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send({message: "An error occurred while updating the data"});
            } else if (result.affectedRows === 0) {
                res.status(404).send({message: "Star not found"});
            } else {
                res.status(200).json({
                    message: `Star was updated successfully!`
                });
            }
        });
    }
});


export default router;