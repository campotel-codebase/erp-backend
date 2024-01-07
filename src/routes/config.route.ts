import express from "express";
import {
	setBenefits,
	setDepartments,
	setJobTitles,
	setTalentSegments,
} from "../functions/config.function";
const config = express.Router();

config.patch("/departments", async (req, res) => {
	const currentUser = req.authorization;
	const toString = JSON.stringify(req.body.departments);
	const prepData = {
		departments: toString,
	};
	try {
		const result = await setDepartments(prepData, currentUser.companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
config.patch("/job-titles", async (req, res) => {
	const currentUser = req.authorization;
	const toString = JSON.stringify(req.body.jobTitles);
	const prepData = {
		jobTitles: toString,
	};
	try {
		const result = await setJobTitles(prepData, currentUser.companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
config.patch("/talent-segments", async (req, res) => {
	const currentUser = req.authorization;
	const toString = JSON.stringify(req.body.talentSegments);
	const prepData = {
		talentSegments: toString,
	};
	try {
		const result = await setTalentSegments(prepData, currentUser.companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
config.patch("/benefits", async (req, res) => {
	const currentUser = req.authorization;
	const toString = JSON.stringify(req.body.benefits);
	const prepData = {
		benefits: toString,
	};
	try {
		const result = await setBenefits(prepData, currentUser.companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

export default config;
