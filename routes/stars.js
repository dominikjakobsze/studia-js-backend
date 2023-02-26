import express from "express";
import multer from "multer";
import path from "path";
import {fileURLToPath} from 'url';
import * as fs from "fs";

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

router.post("/", upload.single("image"), (req, res) => {
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
    res.send({
        message: "You have added a new start!",
        data: {
            name,
            article,
            imageUrl: file
        },
    });
});

export default router;