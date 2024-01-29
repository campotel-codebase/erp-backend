import {checkSchema} from "express-validator";
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
