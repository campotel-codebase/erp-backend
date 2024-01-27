import express, {Request, Response} from "express";
import {userSignIn, userSignUp, userPwdResetLink, userResetPwd} from "../functions/user.function";
import {isUserEmailExists} from "../middlewares/user.middleware";
import {
	employeePwdResetLink,
	employeeResetPwd,
	employeeSignIn,
} from "../functions/portal/post.portal.function";
import {signUpValidationSchema} from "../validator-schemas/user.validator-schema";
import {expressValidatorResult} from "../middlewares/express-validator.middleware";
const publicRoute = express.Router();

/* 
	Post requests
*/
publicRoute.post(
	"/user/sign-up",
	signUpValidationSchema,
	expressValidatorResult,
	async (req: Request, res: Response) => {
		try {
			const result = await userSignUp(req.body);
			res.status(result.status).json(result.data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
publicRoute.post("/user/sign-in", async (req, res) => {
	try {
		const result = await userSignIn(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
publicRoute.post("/user/forgot-password", isUserEmailExists, async (req, res) => {
	try {
		const result = await userPwdResetLink(req.body.email);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
publicRoute.post("/user/reset-password", async (req, res) => {
	try {
		const result = await userResetPwd(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

// Portal
publicRoute.post("/employee/sign-in", async (req, res) => {
	try {
		const result = await employeeSignIn(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
publicRoute.post("/employee/forgot-password", async (req, res) => {
	try {
		const result = await employeePwdResetLink(req.body.email);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
publicRoute.post("/employee/reset-password", async (req, res) => {
	try {
		const result = await employeeResetPwd(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
/* 
	Post requests
*/

export default publicRoute;
