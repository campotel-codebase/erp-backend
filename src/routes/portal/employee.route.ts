import express from "express";
const portal = express.Router();

portal.post("/create/leave-request", async (req, res) => {
	const company = req.employeeAuthCreds;
	res.json(company);
});

export default portal;
