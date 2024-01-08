import multer from "multer";
import {generateUuid} from "../utils/uuid.util";

const MIME_TYPE_MAP: {[key: string]: string} = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
};
const csvStorage = multer.memoryStorage();
const imageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/avatar/");
	},
	filename: async function (req, file, cb) {
		const uuid = await generateUuid();
		const ext = file.originalname.split(".").pop();
		const fileName = `${uuid}.${ext}`;
		cb(null, fileName);
	},
});

export const uploadCsv = multer({storage: csvStorage});
export const uploadImage = multer({
	storage: imageStorage,
	fileFilter: (req, file, cb) => {
		if (MIME_TYPE_MAP[file.mimetype]) {
			cb(null, true);
		} else {
			cb(null, false);
		}
	},
});
