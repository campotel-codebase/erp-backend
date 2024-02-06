import express, {Request, Response} from "express";
import {makeLeaveRequest} from "../../functions/portal/post.portal.function";
import {getLeaveRequest} from "../../functions/portal/get.portal.function";
import {updateLeaveRequestStatus} from "../../functions/portal/patch.portal.function";
import {findEmployee, getEmployee} from "../../functions/shared.function";
import {queryRule} from "../../validator/common.validator";
import {expressValidatorResult} from "../../middlewares/express-validator.middleware";
const portal = express.Router();

/* 
	Post requests
*/
portal.post("/make/leave-request", async (req: Request, res: Response) => {
	const {body} = req;
	try {
		const employee = req.employeeAuthCreds.employee;
		const result = await makeLeaveRequest(body, employee);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
/* 
	Post requests
*/

/* 
	Get requests
*/
portal.get("/get/employee-profile", async (req: Request, res: Response) => {
	const employeeUuid = req.employeeAuthCreds.employee.uuid;
	try {
		const {status, data} = await getEmployee(employeeUuid);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
portal.get(
	"/find/employee",
	[queryRule, expressValidatorResult],
	async (req: Request, res: Response) => {
		const companyUuid = req.employeeAuthCreds.company.uuid;
		const keyword = req.query.keyword;

		try {
			const {status, data} = await findEmployee(companyUuid, keyword);
			res.status(status).json(data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
portal.get("/view/leave-request/:leaveRequestUuid", async (req: Request, res: Response) => {
	const {leaveRequestUuid} = req.params;
	try {
		const result = await getLeaveRequest(leaveRequestUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
/* 
	Get requests
*/

/* 
	Patch requests
*/
portal.patch("/respond/leave-request/:leaveRequestUuid", async (req: Request, res: Response) => {
	const {leaveRequestUuid} = req.params;
	const employee = req.employeeAuthCreds.employee;
	const {body} = req;
	try {
		const result = await updateLeaveRequestStatus(leaveRequestUuid, employee, body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
/* 
	Patch requests
*/

export default portal;
