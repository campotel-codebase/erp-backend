import {checkSchema} from "express-validator";
import {
	commonStringValidator,
	passwordValidator,
	emailValidator,
	personNameValidator,
} from "./shared.validator";
import {userCheckEmailValidator} from "./custom/validator";

export const userSignUpVS = checkSchema({
	companyName: {
		...commonStringValidator,
	},
	lastName: {
		...personNameValidator,
	},
	firstName: {
		...personNameValidator,
	},
	email: {
		...emailValidator,
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await userCheckEmailValidator(value);
				if (isEmailUsed) {
					throw new Error("already in use");
				}
			},
		},
	},
	password: passwordValidator,
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
