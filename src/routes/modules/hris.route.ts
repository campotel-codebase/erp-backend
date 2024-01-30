import express, {Request, Response} from "express";
import {
	findEmployee,
	getEmployee,
	getEmployees,
	getOrgChart,
} from "../../functions/modules/hris/get.hris.function";
import {
	importEmployees,
	makeEmployee,
	makeEmployees,
} from "../../functions/modules/hris/post.hris.function";
import {
	applyBankAccountToEmployee,
	updateBankAccountData,
	updateEmployeeData,
	updateEmployeeEmploymentStatus,
	updateEmploymentHistoryData,
} from "../../functions/modules/hris/patch.hris.function";
import {uploadCsv} from "../../middlewares/multer.middleware";
import {uniqueEmails, uniquePhoneNumbers} from "../../middlewares/employee.middleware";
import {makeEmployeeVS, makeEmployeesVS} from "../../validator/modules/hris.validator";
import {expressValidatorResult} from "../../middlewares/express-validator.middleware";

const hris = express.Router();

/* 
	Get requests
*/
hris.get("/get/employees", async (req, res) => {
	const company = req.userAuthCreds.company;
	try {
		const {status, data} = await getEmployees(company);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.get("/get/employee/:employeeUuid", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {employeeUuid} = req.params;

	try {
		const {status, data} = await getEmployee(company, employeeUuid);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.get("/find/employee", async (req, res) => {
	const company = req.userAuthCreds.company;
	const keyword = req.query.keyword;

	try {
		const {status, data} = await findEmployee(company, keyword);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.get("/get/org-chart/:employeeUuid", async (req, res) => {
	const {employeeUuid} = req.params;
	try {
		const {status, data} = await getOrgChart(employeeUuid);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
/* 
	Get requests
*/

/* 
	Post requests
*/

hris.post("/import/employees", uploadCsv.single("csv"), async (req, res) => {
	const company = req.userAuthCreds.company;
	const csvBuffer = req.file?.buffer.toString("utf8");

	if (!csvBuffer) {
		res.status(400).json({error: "please provide a csv"});
	} else {
		try {
			const {status, data} = await importEmployees(company, csvBuffer);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	}
});
hris.post(
	"/make/employees",
	makeEmployeesVS,
	expressValidatorResult,
	async (req: Request, res: Response) => {
		const company = req.userAuthCreds.company;
		const body = req.body.employees;

		try {
			const {status, data} = await makeEmployees(company, body);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
hris.post(
	"/make/employee",
	makeEmployeeVS,
	expressValidatorResult,
	async (req: Request, res: Response) => {
		const company = req.userAuthCreds.company;
		const {body} = req;

		try {
			const {status, data} = await makeEmployee(company, body);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
/* 
	Post requests
*/

/* 
	Patch requests
*/

hris.patch("/update/offboard-employee/:employeeUuid", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {employeeUuid} = req.params;
	const {body} = req;

	try {
		const {status, data} = await updateEmployeeEmploymentStatus(company, employeeUuid, body);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.patch("/update/assign-bank-account-to-employee/:employeeUuid", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {employeeUuid} = req.params;
	const {body} = req;

	try {
		const {status, data} = await applyBankAccountToEmployee(company, employeeUuid, body);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.patch("/update/employee/:employeeUuid", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {employeeUuid} = req.params;
	const {body} = req;

	try {
		const {status, data} = await updateEmployeeData(company, employeeUuid, body);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.patch("/update/employment-history/:employmentHistoryUuid", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {employmentHistoryUuid} = req.params;
	const {body} = req;

	try {
		const {status, data} = await updateEmploymentHistoryData(company, employmentHistoryUuid, body);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.patch("/update/bank-account/:bankAccountUuid", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {bankAccountUuid} = req.params;
	const {body} = req;

	try {
		const {status, data} = await updateBankAccountData(company, bankAccountUuid, body);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
/* 
	Patch requests
*/

export default hris;
