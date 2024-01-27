import express, {Request, Response} from "express";
import {userSignIn, userSignUp, userPwdResetLink, userResetPwd} from "../functions/user.function";
import {
	employeePwdResetLink,
	employeeResetPwd,
	employeeSignIn,
} from "../functions/portal/post.portal.function";
import {expressValidatorResult} from "../middlewares/express-validator.middleware";
import {userSignInVS, userSignUpVS, userForgotPasswordVS} from "../validator/user.validator";
import {EmployeeForgotPasswordVS, employeeSignInVS} from "../validator/employee.validator";
import {resetPasswordVS} from "../validator/common.validator";
const publicRoute = express.Router();

/* 
	Post requests
*/
publicRoute.post(
	"/user/sign-up",
	userSignUpVS,
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
publicRoute.post(
	"/user/sign-in",
	userSignInVS,
	expressValidatorResult,
	async (req: Request, res: Response) => {
		try {
			const result = await userSignIn(req.body);
			res.status(result.status).json(result.data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
publicRoute.post(
	"/user/forgot-password",
	userForgotPasswordVS,
	expressValidatorResult,
	async (req: Request, res: Response) => {
		try {
			const result = await userPwdResetLink(req.body.email);
			res.status(result.status).json(result.data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
publicRoute.post(
	"/user/reset-password/:passwordResetUuid",
	resetPasswordVS,
	expressValidatorResult,
	async (req: Request, res: Response) => {
		const {passwordResetUuid} = req.params;
		const {body} = req;
		try {
			const result = await userResetPwd(body, passwordResetUuid);
			res.status(result.status).json(result.data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);

// Portal
publicRoute.post(
	"/employee/sign-in",
	employeeSignInVS,
	expressValidatorResult,
	async (req: Request, res: Response) => {
		try {
			const result = await employeeSignIn(req.body);
			res.status(result.status).json(result.data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
publicRoute.post(
	"/employee/forgot-password",
	EmployeeForgotPasswordVS,
	expressValidatorResult,
	async (req: Request, res: Response) => {
		try {
			const result = await employeePwdResetLink(req.body.email);
			res.status(result.status).json(result.data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
publicRoute.post(
	"/employee/reset-password/:passwordResetUuid",
	resetPasswordVS,
	expressValidatorResult,
	async (req: Request, res: Response) => {
		const {passwordResetUuid} = req.params;
		const {body} = req;
		try {
			const result = await employeeResetPwd(body, passwordResetUuid);
			res.status(result.status).json(result.data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	},
);
/* 
	Post requests
*/

export default publicRoute;
