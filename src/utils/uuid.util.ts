import {promisify} from "util";
import crypto from "crypto";
import {v4, v5} from "uuid";

const randomBytesAsync = promisify(crypto.randomBytes);

export const generateUuid = async () => {
	const generateHexadecimal = (await randomBytesAsync(32)).toString("hex");
	const MY_NAMESPACE = v4();
	const uuid = v5(generateHexadecimal, MY_NAMESPACE);
	return uuid;
};
