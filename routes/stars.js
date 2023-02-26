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
    res.send("Hello World!");
});

router.post("/", upload.single("image"), async (req, res) => {
    const {name, article} = req.body;
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
            res.send({
                message: "You have added a new star!"
            });
        }
    });

});

export default router;