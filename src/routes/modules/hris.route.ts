import express from "express";
import {
	findEmployee,
	getEmployee,
	getEmployees,
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
hris.get("/get/OrgChart", async (req, res) => {
	try {
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

hris.post("/import/employees", async (req, res) => {
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
hris.post("/make/employees", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {body} = req.body;

	try {
		const {status, data} = await makeEmployees(company, body);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.post("/make/employee", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {body} = req.body;

	try {
		const {status, data} = await makeEmployee(company, body);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
/* 
	Post requests
*/

/* 
	Patch requests
*/

hris.patch("/update/offboardEmployee/:employeeUuid", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {employeeUuid} = req.params;
	const {body} = req.body;

	try {
		const {status, data} = await updateEmployeeEmploymentStatus(company, employeeUuid, body);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.patch("/update/assignBankAccountToEmployee/:employeeUuid", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {employeeUuid} = req.params;
	const {body} = req.body;

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
	const {body} = req.body;

	try {
		const {status, data} = await updateEmployeeData(company, employeeUuid, body);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.patch("/update/employmentHistory/:employmentHistoryUuid", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {employmentHistoryUuid} = req.params;
	const {body} = req.body;

	try {
		const {status, data} = await updateEmploymentHistoryData(company, employmentHistoryUuid, body);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.patch("/update/bankAccount/:bankAccountUuid", async (req, res) => {
	const company = req.userAuthCreds.company;
	const {bankAccountUuid} = req.params;
	const {body} = req.body;

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
