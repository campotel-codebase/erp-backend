import {checkSchema} from "express-validator";
import {commonStringRule, passwordRule, emailRule, personNameRule} from "./common.validator";
import {userCheckEmailValidator} from "./custom/validator";

export const userSignUpVS = checkSchema({
	companyName: {
		...commonStringRule,
	},
	lastName: {
		...personNameRule,
	},
	firstName: {
		...personNameRule,
	},
	email: {
		...emailRule,
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await userCheckEmailValidator(value);
				if (isEmailUsed) {
					throw new Error("already in use");
				}
			},
		},
	},
	password: passwordRule,
});

export const userSignInVS = checkSchema({
	email: {
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await userCheckEmailValidator(value);
				if (!isEmailUsed) {
					throw new Error("does not exists");
				}
			},
		},
	},
});

export const userForgotPasswordVS = checkSchema({
	email: {
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await userCheckEmailValidator(value);
				if (!isEmailUsed) {
					throw new Error("does not exists");
				}
			},
		},
	},
});
