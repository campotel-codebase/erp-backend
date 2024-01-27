import {checkSchema} from "express-validator";
import prisma from "../../libs/prisma";

const commonSchema = {
	isString: true,
	notEmpty: true,
	trim: true,
};

export const signUpValidationSchema = checkSchema({
	companyName: {
		...commonSchema,
		errorMessage: "Company name is required and must be a valid string",
	},
	lastName: {
		...commonSchema,
		errorMessage: "Last name is required and must be a valid string",
	},
	firstName: {
		...commonSchema,
		errorMessage: "First name is required and must be a valid string",
	},
	email: {
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await prisma.user.findUnique({
					where: {email: value},
					select: {email: true},
				});
				if (isEmailUsed) {
					throw new Error("E-mail already in use");
				}
			},
		},
		isEmail: true,
		errorMessage: "Email address is required and must be valid",
	},
	password: {
		...commonSchema,
		isLength: {
			options: {min: 8},
			errorMessage: "Password is required and should be at least 8 characters",
		},
	},
});
