import express, {Request, Response} from "express";
import {
	setBenefits,
	setDepartments,
	setJobTitles,
	setTalentSegments,
} from "../functions/config.function";
const config = express.Router();

/* 
	Patch requests
*/
config.patch("/set/departments", async (req: Request, res: Response) => {
	const companyUuid = req.userAuthCreds.company.uuid;
	const toString = JSON.stringify(req.body.departments);
	const prepData = {
		departments: toString,
	};
	try {
		const {status, data} = await setDepartments(prepData, companyUuid);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
config.patch("/set/job-titles", async (req: Request, res: Response) => {
	const companyUuid = req.userAuthCreds.company.uuid;
	const toString = JSON.stringify(req.body.jobTitles);
	const prepData = {
		jobTitles: toString,
	};
	try {
		const {status, data} = await setJobTitles(prepData, companyUuid);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
config.patch("/set/talent-segments", async (req: Request, res: Response) => {
	const companyUuid = req.userAuthCreds.company.uuid;
	const toString = JSON.stringify(req.body.talentSegments);
	const prepData = {
		talentSegments: toString,
	};
	try {
		const {status, data} = await setTalentSegments(prepData, companyUuid);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
config.patch("/set/benefits", async (req: Request, res: Response) => {
	const companyUuid = req.userAuthCreds.company.uuid;
	const toString = JSON.stringify(req.body.benefits);
	const prepData = {
		benefits: toString,
	};
	try {
		const {status, data} = await setBenefits(prepData, companyUuid);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
/* 
	Patch requests
*/
export default config;
