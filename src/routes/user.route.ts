import express from "express";
import {profile} from "../functions/user.function";
const user = express.Router();

user.get("/profile", async (req, res) => {
	const currentUser = req.authorization;
	try {
		const result = await profile(currentUser.userUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

user.put("/update-avatar", async (req, res) => {
	try {
		res.json("avatar");
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

export default user;
