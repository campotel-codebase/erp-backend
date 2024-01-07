import express from "express";
import {profile} from "../functions/user";
const user = express.Router();

user.get("/profile", async (req, res) => {
	const currentUser = req.authorization;
	try {
		const result = await profile(currentUser.userUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json(error);
	}
});

export default user;
