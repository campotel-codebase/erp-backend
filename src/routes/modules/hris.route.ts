import express from "express";
import {uploadCsv} from "../../middlewares/multer.middleware";
import {
	assignBankAccount,
	onBoardEmployees,
	employee,
	employees,
	employeesCsvToJsonArray,
	offboardEmployee,
	onboardEmployee,
	orgChartTree,
	searchEmployee,
} from "../../functions/modules/hris.function";
const hris = express.Router();

hris.post("/import-employees", uploadCsv.single("csv"), async (req, res) => {
	const company = req.authCreds.company.benefits;
	const csvBuffer = req.file?.buffer.toString("utf8");

	if (!csvBuffer) {
		res.status(400).json({error: "please provide a csv"});
	} else {
		try {
			const result = await employeesCsvToJsonArray(csvBuffer, company);
			res.status(result.status).json(result.data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	}
});

hris.post("/onboard-employee", async (req, res) => {
	const company = req.authCreds.company.id;
	try {
		const result = await onboardEmployee(req.body, company);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.post("/create-employees", async (req, res) => {
	const company = req.authCreds.company.id;
	try {
		const result = await onBoardEmployees(req.body, company);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.patch("/offboard-employee/:employeeUuid", async (req, res) => {
	const company = req.authCreds.company.uuid;
	const {employeeUuid} = req.params;
	try {
		const result = await offboardEmployee(req.body, employeeUuid, company);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.patch("/assign-bank-account/:employeeUuid", async (req, res) => {
	const company = req.authCreds.company.uuid;
	const {employeeUuid} = req.params;
	try {
		const result = await assignBankAccount(req.body, employeeUuid, company);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.get("/employees", async (req, res) => {
	const companyUuid = req.authCreds.company.uuid;
	try {
		const result = await employees(companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.get("/search-employee", async (req, res) => {
	const companyUuid = req.authCreds.company.uuid;
	const keyword = req.query.keyword;
	try {
		const result = await searchEmployee(companyUuid, keyword);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.get("/employee/:employeeUuid", async (req, res) => {
	const companyUuid = req.authCreds.company.uuid;
	const {employeeUuid} = req.params;
	try {
		const result = await employee(companyUuid, employeeUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.get("/org-chart-tree/:employeeUuid", async (req, res) => {
	const companyUuid = req.authCreds.company.uuid;
	const {employeeUuid} = req.params;
	try {
		const result = await orgChartTree(companyUuid, employeeUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

export default hris;
