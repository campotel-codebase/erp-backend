import prisma from "../../libs/prisma";
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {
	EmployeeAuthCredentialsType,
	jwtPayloadType,
	userAuthCredentialsType,
} from "../../types/jwt-payload";

declare module "express-serve-static-core" {
	interface Request {
		userAuthCreds: userAuthCredentialsType;
		employeeAuthCreds: EmployeeAuthCredentialsType;
	}
}

const decodeToken = (req: Request) => {
	const secret = process.env.AUTH_KEY;
	const authHeader = req.headers.authorization;
	if (secret) {
		if (authHeader) {
			const token = authHeader.split(" ")[1];
			const tokenProperties = jwt.verify(token, secret);
			return tokenProperties as jwtPayloadType;
		} else {
			throw new Error("undefined auth header");
		}
	} else {
		throw new Error("undefined token secret");
	}
};

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tokenPayload = decodeToken(req);
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
						avatar: true,
					},
				},
			},
		});
		const prepData: userAuthCredentialsType = {
			company: {
				id: validatePayload.id,
				uuid: validatePayload.uuid,
				name: validatePayload.name,
				benefits: validatePayload.benefits,
			},
			user: {
				id: validatePayload.User[0].id,
				uuid: validatePayload.User[0].uuid,
				avatar: validatePayload.User[0].avatar,
			},
		};
		req.userAuthCreds = prepData;
		next();
	} catch (error: any) {
		res.status(401).json({error: error.message});
	}
};

export const employeeAuth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tokenPayload = decodeToken(req);
		const validatePayload = await prisma.company.findUniqueOrThrow({
			where: {uuid: tokenPayload.companyUuid},
			select: {
				id: true,
				uuid: true,
				name: true,
				benefits: true,
				Employee: {
					where: {
						uuid: tokenPayload.userUuid,
					},
					select: {
						id: true,
						uuid: true,
						fullName: true,
						ReportingTo: {
							select: {uuid: true, suffix: true, fullName: true, email: true},
						},
					},
				},
			},
		});
		const company = validatePayload;
		const employee = validatePayload.Employee[0];
		const reportingTo = validatePayload.Employee[0].ReportingTo;

		const prepData: EmployeeAuthCredentialsType = {
			company: {
				id: company.id,
				uuid: company.uuid,
				name: company.name,
				benefits: company.benefits,
			},
			employee: {
				id: employee.id,
				uuid: employee.uuid,
				fullName: employee.fullName,
				reportingTo: () => {
					if (reportingTo) {
						return {
							uuid: reportingTo.uuid,
							suffix: reportingTo.suffix,
							fullName: reportingTo?.fullName,
							email: reportingTo.email,
						};
					} else {
						return null;
					}
				},
			},
		};
		req.employeeAuthCreds = prepData;
		next();
	} catch (error: any) {
		res.status(401).json({error: error.message});
	}
};
