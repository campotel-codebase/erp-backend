import express from "express";
import {userSignIn, userSignUp, userPwdResetLink, userResetPwd} from "../functions/user.function";
const publicRoute = express.Router();

publicRoute.post("/user/sign-up", async (req, res) => {
	try {
		const result = await userSignUp(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
publicRoute.post("/user/sign-in", async (req, res) => {
	try {
		const result = await userSignIn(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
publicRoute.post("/user/forgot-password", async (req, res) => {
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
publicRoute.post("/employee/sign-in", async (req, res) => {});
publicRoute.post("/employee/forgot-password", async (req, res) => {});
publicRoute.post("/employee/reset-password", async (req, res) => {});

export default publicRoute;
