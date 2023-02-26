import express from "express";
import connection from "../db.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/", upload.any(), (req, res) => {
    res.send(req.body);
});

export default router;