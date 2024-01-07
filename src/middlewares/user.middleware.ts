import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

export const decodeToken = (req: Request, res: Response) => {
	const secret = process.env.AUTH_KEY;
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		const tokenProperties = jwt.verify(token, secret);
		res.status(200).json(tokenProperties);
	} else {
		res.status(401).json("undefined auth header");
	}
};
