import {checkSchema} from "express-validator";
import {checkResetPasswordUuidValidator} from "./custom.validator";
import {formatISO} from "date-fns";

export const commonStringRule = {
	isString: true,
	notEmpty: true,
	trim: true,
};

export const passwordRule = {
	...commonStringRule,
	isLength: {
		options: {min: 8},
		errorMessage: "Password is required and should be at least 8 characters",
	},
};

export const resetPasswordVS = checkSchema({
	newPassword: passwordRule,
	passwordResetUuid: {
		...commonStringRule,
		custom: {
			options: async (value: string) => {
				const isPasswordResetUuidExists = await checkResetPasswordUuidValidator(value);
				if (!isPasswordResetUuidExists) {
					throw new Error("reset token does not exists");
				}
			},
		},
	},
});

export const dateRule = {
	isISO8601: {
		bail: true,
		errorMessage: "Please use ISO 8601 format",
	},
	toDate: true,
	notEmpty: true,
	customSanitizer: {
		options: (value: Date) => formatISO(value),
	},
};
