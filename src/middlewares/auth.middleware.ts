import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {jwtPayloadType} from "../../types/jwt-payload";

declare module "express-serve-static-core" {
	interface Request {
		authorization: jwtPayloadType;
	}
}

export const authorization = (req: Request, res: Response, next: NextFunction) => {
	const secret = process.env.AUTH_KEY;
	const authHeader = req.headers.authorization;
	if (secret) {
		if (authHeader) {
			const token = authHeader.split(" ")[1];
			const tokenProperties: any = jwt.verify(token, secret);
			req.authorization = tokenProperties;
			next();
		} else {
			res.status(401).json("undefined auth header");
		}
	} else {
		res.status(401).json("undefined token secret");
	}
};
