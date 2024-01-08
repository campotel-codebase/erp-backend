import express from "express";
import {profile, updateAvatar} from "../functions/user.function";
import {uploadImage} from "../middlewares/multer.middleware";
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

user.put("/update-avatar", uploadImage.single("avatar"), async (req, res) => {
	const currentUser = req.authorization;
	const url = req.protocol + "://" + req.get("host");
	const fileName = req.file?.filename;
	const filePath = "/public/avatar/";
	const imgSrc = url + filePath + fileName;

	try {
		const result = await updateAvatar(imgSrc, currentUser.userUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

export default user;
