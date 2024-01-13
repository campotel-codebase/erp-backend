import express from "express";
import {uploadCsv} from "../../middlewares/multer.middleware";
import {
	assignBankAccount,
	createBankAccount,
	createEmployees,
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
	const companyUuid = req.authorization.companyUuid;
	const csvBuffer = req.file?.buffer.toString("utf8");

	if (!csvBuffer) {
		res.status(400).json({error: "please provide a csv"});
	} else {
		try {
			const result = await employeesCsvToJsonArray(csvBuffer, companyUuid);
			res.status(result.status).json(result.data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	}
});

hris.post("/onboard-employee", async (req, res) => {
	const companyUuid = req.authorization.companyUuid;
	try {
		const result = await onboardEmployee(req.body, companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.post("/create-employees", async (req, res) => {
	const companyUuid = req.authorization.companyUuid;
	try {
		const result = await createEmployees(req.body, companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.patch("/offboard-employee/:employeeUuid", async (req, res) => {
	const companyUuid = req.authorization.companyUuid;
	const {employeeUuid} = req.params;
	try {
		const result = await offboardEmployee(req.body, employeeUuid, companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.post("/create-bank-account", async (req, res) => {
	const companyUuid = req.authorization.companyUuid;
	try {
		const result = await createBankAccount(req.body, companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.patch("/assign-bank-account/:employeeUuid/:bankAccountUuid", async (req, res) => {
	const companyUuid = req.authorization.companyUuid;
	const {employeeUuid, bankAccountUuid} = req.params;
	try {
		const result = await assignBankAccount(employeeUuid, bankAccountUuid, companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.get("/employees", async (req, res) => {
	const companyUuid = req.authorization.companyUuid;
	try {
		const result = await employees(companyUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.get("/search-employee", async (req, res) => {
	const companyUuid = req.authorization.companyUuid;
	const keyword = req.query.keyword;
	try {
		const result = await searchEmployee(companyUuid, keyword);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.get("/employee/:employeeUuid", async (req, res) => {
	const companyUuid = req.authorization.companyUuid;
	const {employeeUuid} = req.params;
	try {
		const result = await employee(companyUuid, employeeUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

hris.get("/org-chart-tree/:employeeUuid", async (req, res) => {
	const companyUuid = req.authorization.companyUuid;
	const {employeeUuid} = req.params;
	try {
		const result = await orgChartTree(companyUuid, employeeUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

export default hris;
