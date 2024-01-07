import express from "express";
import {signUp} from "../functions/user";
const user = express.Router();

user.post("/sign-up", async (req, res) => {
	try {
		const result = await signUp(req.body);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json(error);
	}
});

export default user;
