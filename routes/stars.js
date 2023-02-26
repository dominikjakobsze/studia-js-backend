import express from "express";
import multer from "multer";
import * as fs from "fs";

const router = express.Router();
const upload = multer();

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
    if (file.size > 1000000) {
        res.status(400).send({message: "Image is too big"});
    }
    fs.rename
    res.send({
        message: "You have added a new start!",
        data: {
            name,
            article,
            imageUrl: file,
        },
    });
});

export default router;