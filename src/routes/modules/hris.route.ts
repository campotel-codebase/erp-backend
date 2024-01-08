import express from "express";
import {uploadCsv} from "../../middlewares/multer.middleware";
import {employeesCsvToJsonArray} from "../../functions/modules/hris.function";
const hris = express.Router();

hris.post("/import-employees", uploadCsv.single("csv"), async (req, res) => {
	const expectedHeader = [
		"lastName",
		"firstName",
		"middleName",
		"suffix",
		"phoneNumber",
		"nickname",
		"email",
		"birthday",
		"bloodType",
		"driverLicense",
		"taxId",
	];
	const csvBuffer = req.file?.buffer.toString("utf8");
	if (!csvBuffer) {
		res.status(400).json({error: "please provide a csv"});
	} else {
		try {
			const result = await employeesCsvToJsonArray({expectedHeader, csvBuffer});
			res.status(result.status).json(result.data);
		} catch (error: any) {
			res.status(500).json({error: error.message});
		}
	}
});

export default hris;
