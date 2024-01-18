import express from "express";
import {
	validateLeaveRequest,
	createLeaveRequest,
	viewLeaveRequest,
} from "../../functions/portal/employee.function";
const portal = express.Router();

portal.post("/create/leave-request", async (req, res) => {
	const company = req.employeeAuthCreds.employee;
	const result = await createLeaveRequest(req.body, company);
	res.status(result.status).json(result.data);
});

portal.get("/view/leave-request/:leaveRequestUuid", async (req, res) => {
	const {leaveRequestUuid} = req.params;
	const result = await viewLeaveRequest(leaveRequestUuid);
	res.status(result.status).json(result.data);
});

portal.patch("/validate/leave-request/:leaveRequestUuid", async (req, res) => {
	try {
		const {leaveRequestUuid} = req.params;
		const company = req.employeeAuthCreds.employee;

		const result = await validateLeaveRequest(leaveRequestUuid, company, req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

export default portal;
