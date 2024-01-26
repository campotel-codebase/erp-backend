import express from "express";
import {makeLeaveRequest} from "../../functions/portal/post.portal.function";
import {getLeaveRequest} from "../../functions/portal/get.portal.function";
import {updateLeaveRequestStatus} from "../../functions/portal/patch.portal.function";
const portal = express.Router();

/* 
	Post requests
*/
portal.post("/make/leave-request", async (req, res) => {
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
portal.get("/view/leave-request/:leaveRequestUuid", async (req, res) => {
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
portal.patch("/respond/leave-request/:leaveRequestUuid", async (req, res) => {
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
