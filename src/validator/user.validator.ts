import {checkSchema} from "express-validator";
import {commonStringRule, passwordRule} from "./common.validator";
import {userCheckEmailValidator} from "./custom.validator";

export const userSignUpVS = checkSchema({
	companyName: {
		...commonStringRule,
		errorMessage: "Company name is required and must be a valid string",
	},
	lastName: {
		...commonStringRule,
		errorMessage: "Last name is required and must be a valid string",
	},
	firstName: {
		...commonStringRule,
		errorMessage: "First name is required and must be a valid string",
	},
	email: {
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await userCheckEmailValidator(value);
				if (isEmailUsed) {
					throw new Error("E-mail already in use");
				}
			},
		},
		isEmail: true,
		errorMessage: "Email address is required and must be valid",
	},
	password: passwordRule,
});

export const userSignInVS = checkSchema({
	email: {
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await userCheckEmailValidator(value);
				if (!isEmailUsed) {
					throw new Error("E-mail does not exists");
				}
			},
		},
		isEmail: true,
		errorMessage: "Email address is required and must be valid",
	},
	password: passwordRule,
});

export const userForgotPasswordVS = checkSchema({
	email: {
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await userCheckEmailValidator(value);
				if (!isEmailUsed) {
					throw new Error("E-mail does not exists");
				}
			},
		},
		isEmail: true,
		errorMessage: "Email address is required and must be valid",
	},
});
