import express from "express";
import {setDepartments} from "../functions/config.function";
const config = express.Router();

config.patch("/departments", async (req, res) => {
	const currentUser = req.authorization;
	const body = req.body;
	const departmentsToString = JSON.stringify(body.departments);
	const prepData = {
		departments: departmentsToString,
	};
	try {
		const result = await setDepartments(prepData, currentUser.companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json(error.message);
	}
});
config.post("/job-titles", (req, res) => {});
config.post("/talent-segments", (req, res) => {});
config.post("/benefits", (req, res) => {});

export default config;
