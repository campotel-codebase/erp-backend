import {checkSchema} from "express-validator";
import {passwordRule} from "./common.validator";
import {employeeCheckEmailValidator} from "./custom.validator";

export const employeeSignInVS = checkSchema({
	email: {
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await employeeCheckEmailValidator(value);
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

export const EmployeeForgotPasswordVS = checkSchema({
	email: {
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await employeeCheckEmailValidator(value);
				if (!isEmailUsed) {
					throw new Error("E-mail does not exists");
				}
			},
		},
		isEmail: true,
		errorMessage: "Email address is required and must be valid",
	},
});
