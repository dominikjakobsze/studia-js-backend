import express from "express";

const usersRouter = express.Router();

const users = [
    {
        firstname: "John",
        lastname: "Doe",
        age: 25
    },
    {
        firstname: "Jane",
        lastname: "Doe",
        age: 23
    }
]
usersRouter.get("/", (req, res) => {
    res.send(users);
});

export default usersRouter;