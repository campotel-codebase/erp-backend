import express from "express";
const portal = express.Router();

portal.post("/create/leave-request", async (req, res) => {
    res.json('leave-request')
});

export default portal;
