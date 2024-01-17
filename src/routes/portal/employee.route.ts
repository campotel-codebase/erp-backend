import express from "express";
import {createLeaveRequest} from "../../functions/portal/employee.function";
const portal = express.Router();

portal.post("/create/leave-request", async (req, res) => {
	const company = req.employeeAuthCreds.employee;
	const result = await createLeaveRequest(req.body, company);
	res.status(result.status).json(result.data);
});

export default portal;
