import express from "express";
import {getUserProfile, updateUserAvatar, updateUserProfile} from "../functions/user.function";
import {uploadImage} from "../middlewares/multer.middleware";
const user = express.Router();

/* 
	Get requests
*/
user.get("/get/user-profile", async (req, res) => {
	const userUuid = req.userAuthCreds.user.uuid;
	try {
		const result = await getUserProfile(userUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
/* 
	Get requests
*/

/* 
	Patch requests
*/
user.patch("/update/user-profile", async (req, res) => {
	const userUuid = req.userAuthCreds.user.uuid;
	try {
		const result = await updateUserProfile(req.body, userUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});

/* 
	Patch requests
*/

/* 
	Put requests
*/
user.put("/update/user-avatar", uploadImage.single("avatar"), async (req, res) => {
	const userUuid = req.userAuthCreds.user.uuid;
	const url = req.protocol + "://" + req.get("host");
	const fileName = req.file?.filename;
	const filePath = "/public/avatar/";
	const imgSrc = url + filePath + fileName;

	try {
		const result = await updateUserAvatar(imgSrc, userUuid);
		res.status(result.status).json(result.data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
/* 
	Put requests
*/

export default user;
