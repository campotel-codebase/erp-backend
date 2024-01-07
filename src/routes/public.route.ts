import express from "express";
import {signIn, signUp} from "../functions/user.function";
const publicRoute = express.Router();

publicRoute.post("/user/sign-up", async (req, res) => {
	try {
		const result = await signUp(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
publicRoute.post("/user/sign-in", async (req, res) => {
	try {
		const result = await signIn(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
publicRoute.post("/user/forgot-password", async (req, res) => {
	try {
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
publicRoute.post("/user/reset-password", async (req, res) => {
	try {
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

export default publicRoute;
