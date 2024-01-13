import prisma from "../../libs/prisma";
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {authCredentialsType, jwtPayloadType} from "../../types/jwt-payload";

declare module "express-serve-static-core" {
	interface Request {
		authCreds: authCredentialsType;
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
						id: true,
						uuid: true,
						name: true,
						benefits: true,
						User: {
							where: {
								uuid: tokenPayload.userUuid,
							},
							select: {
								id: true,
								uuid: true,
							},
						},
					},
				});
				const prepData: authCredentialsType = {
					company: {
						id: validatePayload.id,
						uuid: validatePayload.uuid,
						name: validatePayload.name,
						benefits: validatePayload.benefits,
					},
					user: {
						id: validatePayload.User[0].id,
						uuid: validatePayload.User[0].uuid,
					},
				};
				req.authCreds = prepData;
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
