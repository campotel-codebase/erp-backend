import prisma from "../../libs/prisma";
import {Request, Response, NextFunction} from "express";

export const isEmailUsable = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const email = await prisma.user.findUnique({
			where: {email: req.body.email},
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

// export const isEmailExists = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const email = await prisma.user.findUnique({
// 			where: {email: req.body.email},
// 		});
// 		if (email) {
// 			next();
// 		} else {
// 			res.status(404).json("email not found");
// 		}
// 	} catch (error: any) {
// 		res.status(500).json({error: error.message});
// 	}
// };
