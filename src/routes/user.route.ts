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
		const {status, data} = await getUserProfile(userUuid);
		res.status(status).json(data);
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
		const {status, data} = await updateUserProfile(req.body, userUuid);
		res.status(status).json(data);
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
	const user = req.userAuthCreds.user;
	const url = req.protocol + "://" + req.get("host");
	const fileName = req.file?.filename;
	const filePath = "/public/avatar/";
	const imgSrc = url + filePath + fileName;

	try {
		const {status, data} = await updateUserAvatar(imgSrc, user);
		res.status(status).json(data);
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
});
/* 
	Put requests
*/

export default user;
