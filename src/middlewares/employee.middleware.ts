import {Prisma} from "@prisma/client";
import prisma from "../../libs/prisma";
import {Request, Response, NextFunction} from "express";

export const uniqueEmails = async (req: Request, res: Response, next: NextFunction) => {
	const emailFromCsv = req.body.map((employee: Prisma.EmployeeCreateInput) => employee.email);
	try {
		const emails = await prisma.employee.findMany({
			where: {
				email: {
					in: emailFromCsv,
				},
			},
			select: {
				email: true,
			},
		});
		if (emails.length === 0) {
			next();
		} else {
			res.status(409).json({msg: "duplicate values for email not allowed", duplicateEmails: emails});
		}
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
};

export const uniquePhoneNumbers = async (req: Request, res: Response, next: NextFunction) => {
	const phoneNumberFromCsv = req.body.map(
		(employee: Prisma.EmployeeCreateInput) => employee.phoneNumber,
	);
	try {
		const phoneNumbers = await prisma.employee.findMany({
			where: {
				phoneNumber: {
					in: phoneNumberFromCsv,
				},
			},
			select: {
				phoneNumber: true,
			},
		});
		if (phoneNumbers.length === 0) {
			next();
		} else {
			res.status(409).json({
				msg: "duplicate values for phoneNumber not allowed",
				duplicatePhoneNumbers: phoneNumbers,
			});
		}
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
};

export const isEmployeeEmailUsable = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const email = await prisma.employee.findUnique({
			where: {email: req.body.employee.email},
		});
		if (email) {
			res.status(409).json("email already in use");
		} else {
			next();
		}
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
};

export const isEmployeePhoneNumberUsable = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const phoneNumber = await prisma.employee.findUnique({
			where: {phoneNumber: req.body.employee.phoneNumber},
		});
		if (phoneNumber) {
			res.status(409).json("phone number already in use");
		} else {
			next();
		}
	} catch (error: any) {
		res.status(500).json({error: error.message});
	}
};
