import prisma from "../../libs/prisma";
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {jwtPayloadType} from "../../types/jwt-payload";

declare module "express-serve-static-core" {
	interface Request {
		authorization: jwtPayloadType;
	}
}

export const authorization = async (req: Request, res: Response, next: NextFunction) => {
	const secret = process.env.AUTH_KEY;
	const authHeader = req.headers.authorization;
	if (secret) {
		if (authHeader) {
			const token = authHeader.split(" ")[1];
			const tokenProperties = jwt.verify(token, secret);
			const tokenPayload = tokenProperties as jwtPayloadType;
			try {
				const validatePayload = await prisma.company.findUniqueOrThrow({
					where: {uuid: tokenPayload.companyUuid},
					select: {
						uuid: true,
						User: {
							where: {
								uuid: tokenPayload.userUuid,
							},
							select: {
								uuid: true,
							},
						},
					},
				});
				const prepData: jwtPayloadType = {
					companyUuid: validatePayload.uuid,
					userUuid: validatePayload.User[0].uuid,
				};
				req.authorization = prepData;
				next();
			} catch (error: any) {
				res.status(401).json({error: error.message});
			}
		} else {
			res.status(401).json("undefined auth header");
		}
	} else {
		res.status(401).json("undefined token secret");
	}
};
