import express from "express";
import {createLeaveRequest, viewLeaveRequest} from "../../functions/portal/employee.function";
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

export default portal;
