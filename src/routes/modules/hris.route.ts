import express, {Request, Response} from "express";
import {getEmployees, getOrgChart} from "../../functions/modules/hris/get.hris.function";
import {
	importEmployees,
	makeEmployee,
	makeEmployees,
} from "../../functions/modules/hris/post.hris.function";
import {
	applyBankAccountToEmployee,
	reassignEmployeeIS,
	updateBankAccountData,
	updateEmployeeData,
	updateEmployeeEmploymentStatus,
	updateEmploymentHistoryData,
} from "../../functions/modules/hris/patch.hris.function";
import {uploadCsv, uploadImage} from "../../middlewares/multer.middleware";
import {expressValidatorResult} from "../../middlewares/express-validator.middleware";
import {queryRule} from "../../validator/shared.validator";
import {
	isEmployeeBelongToCompany,
	isEmployeeBelongToCompanyForIs,
} from "../../middlewares/authorization.middleware";
import {updateEmployeeAvatar} from "../../functions/modules/hris/put.hris.function";
import {findEmployee, getEmployee} from "../../functions/shared.function";
import makeEmployeesValidator from "../../validator/modules/hris/make-employees.validator";
import makeEmployeeValidator from "../../validator/modules/hris/make-employee.validator";

const hris = express.Router();

/* 
	Get requests
*/
hris.get("/get/employees", async (req: Request, res: Response) => {
	const company = req.userAuthCreds.company;
	const page = req.query.page;

	try {
		const {status, data} = await getEmployees(company, typeof page === "string" ? parseInt(page) : 1);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
hris.get(
	"/get/employee/:employeeUuid",
	[isEmployeeBelongToCompany],
	async (req: Request, res: Response) => {
		const employeeUuid = req.selectedEmployee.uuid;

		try {
			const {status, data} = await getEmployee(employeeUuid);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
hris.get(
	"/find/employee",
	[queryRule, expressValidatorResult],
	async (req: Request, res: Response) => {
		const companyUuid = req.userAuthCreds.company.uuid;
		const keyword = req.query.keyword;

		try {
			const {status, data} = await findEmployee(companyUuid, keyword);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
hris.get(
	"/get/org-chart/:employeeUuid",
	[isEmployeeBelongToCompany],
	async (req: Request, res: Response) => {
		const selectedEmployee = req.selectedEmployee;
		try {
			const {status, data} = await getOrgChart(selectedEmployee);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
/* 
	Get requests
*/

/* 
	Post requests
*/

hris.post("/import/employees", [uploadCsv.single("csv")], async (req: Request, res: Response) => {
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
	[...makeEmployeesValidator, expressValidatorResult],
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
	[...makeEmployeeValidator, expressValidatorResult, isEmployeeBelongToCompanyForIs],
	async (req: Request, res: Response) => {
		const company = req.userAuthCreds.company;
		const selectedEmployeeForIs = req.selectedEmployeeForIs;
		const {body} = req;

		try {
			const {status, data} = await makeEmployee(company, selectedEmployeeForIs, body);
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

hris.patch(
	"/update/offboard-employee/:employeeUuid",
	[isEmployeeBelongToCompany],
	async (req: Request, res: Response) => {
		const company = req.userAuthCreds.company;
		const selectedEmployee = req.selectedEmployee;
		const {body} = req;

		try {
			const {status, data} = await updateEmployeeEmploymentStatus(company, selectedEmployee, body);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
hris.patch(
	"/update/assign-bank-account-to-employee/:employeeUuid",
	[isEmployeeBelongToCompany],
	async (req: Request, res: Response) => {
		const company = req.userAuthCreds.company;
		const selectedEmployee = req.selectedEmployee;
		const {body} = req;

		try {
			const {status, data} = await applyBankAccountToEmployee(company, selectedEmployee, body);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
hris.patch(
	"/update/employee/:employeeUuid",
	[isEmployeeBelongToCompany],
	async (req: Request, res: Response) => {
		const selectedEmployee = req.selectedEmployee;
		const {body} = req;

		try {
			const {status, data} = await updateEmployeeData(selectedEmployee, body);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
hris.patch(
	"/update/employment-history/:employmentHistoryUuid",
	async (req: Request, res: Response) => {
		const company = req.userAuthCreds.company;
		const {employmentHistoryUuid} = req.params;
		const {body} = req;

		try {
			const {status, data} = await updateEmploymentHistoryData(company, employmentHistoryUuid, body);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
hris.patch("/update/bank-account/:bankAccountUuid", async (req: Request, res: Response) => {
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
hris.patch(
	"/update/employee-immediate-superior/:employeeUuid",
	[isEmployeeBelongToCompany, isEmployeeBelongToCompanyForIs],
	async (req: Request, res: Response) => {
		const selectedEmployee = req.selectedEmployee;
		const selectedEmployeeForIs = req.selectedEmployeeForIs;
		try {
			const {status, data} = await reassignEmployeeIS(selectedEmployee, selectedEmployeeForIs);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
/* 
	Patch requests
*/

/* 
	Put requests
*/
hris.put(
	"/update/employee-avatar/:employeeUuid",
	[isEmployeeBelongToCompany, uploadImage.single("avatar")],
	async (req: Request, res: Response) => {
		const selectedEmployee = req.selectedEmployee;
		const url = req.protocol + "://" + req.get("host");
		const fileName = req.file?.filename;
		const filePath = "/public/avatar/";
		const imgSrc = url + filePath + fileName;

		try {
			const {status, data} = await updateEmployeeAvatar(imgSrc, selectedEmployee);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
/* 
	Put requests
*/
export default hris;
