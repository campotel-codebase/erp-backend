import {checkSchema} from "express-validator";
import {passwordRule, emailRule} from "./common.validator";
import {employeeCheckEmailValidator} from "./custom.validator";

export const employeeSignInVS = checkSchema({
	email: {
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await employeeCheckEmailValidator(value);
				if (!isEmailUsed) {
					throw new Error("does not exists");
				}
			},
		},
	},
	password: passwordRule,
});

export const EmployeeForgotPasswordVS = checkSchema({
	email: {
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await employeeCheckEmailValidator(value);
				if (!isEmailUsed) {
					throw new Error("does not exists");
				}
			},
		},
	},
});
