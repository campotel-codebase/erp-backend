import express from "express";
import {signIn, signUp} from "../functions/user";
const publicRoutes = express.Router();

publicRoutes.post("/user/sign-up", async (req, res) => {
	try {
		const result = await signUp(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json(error);
	}
});
publicRoutes.post("/user/sign-in", async (req, res) => {
	try {
		const result = await signIn(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json(error);
	}
});

export default publicRoutes;