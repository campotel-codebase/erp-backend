import jwt from "jsonwebtoken";
import {jwtPayloadType} from "../../types/jwt-payload";

export const generateJwt = (payload: jwtPayloadType) => {
	const secret = process.env.AUTH_KEY;
	const expiresAt = process.env.AUTH_EXPIRATION;
	if (secret && expiresAt) {
		return jwt.sign(payload, secret, {
			expiresIn: expiresAt,
		});
	}
};
