import express from "express";
import {uploadCsv} from "../../middlewares/multer.middleware";
import {
	createBankAccount,
	createEmployee,
	employeesCsvToJsonArray,
	onboardEmployee,
} from "../../functions/modules/hris.function";
const hris = express.Router();

hris.post("/import-employees", uploadCsv.single("csv"), async (req, res) => {
	const currentUser = req.authorization;
	const csvBuffer = req.file?.buffer.toString("utf8");

	if (!csvBuffer) {
		res.status(400).json({error: "please provide a csv"});
	} else {
		try {
			const result = await employeesCsvToJsonArray(csvBuffer, currentUser.companyUuid);
			res.status(result.status).json(result.data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	}
});

hris.post("/create-employee", async (req, res) => {
	const currentUser = req.authorization;
	try {
		const result = await createEmployee(req.body, currentUser.companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.patch("/onboard-employee", async (req, res) => {
	try {
		const result = await onboardEmployee(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.post("/create-bank-account", async (req, res) => {
	const currentUser = req.authorization;
	try {
		const result = await createBankAccount(req.body, currentUser.companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

export default hris;
