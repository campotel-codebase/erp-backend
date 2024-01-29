import {checkSchema} from "express-validator";
import {checkResetPasswordUuidValidator} from "./custom.validator";
import {formatISO} from "date-fns";

export const commonStringRule = {
	notEmpty: true,
	isString: true,
	trim: true,
};

export const personNameRule = {
	notEmpty: true,
	isString: true,
	trim: true,
	isLength: {
		bail: true,
		options: {max: 30},
		errorMessage: "must not exceed 100 characters",
	},
};

export const passwordRule = {
	...commonStringRule,
	isLength: {
		options: {min: 8},
		errorMessage: "value is required and should be at least 8 characters",
	},
};

export const emailRule = {
	trim: true,
	isEmail: {
		bail: true,
	},
	isLength: {
		bail: true,
		options: {max: 100},
		errorMessage: "must not exceed 100 characters",
	},
};

export const phoneNumberRule = {
	notEmpty: true,
	isString: true,
	trim: true,
	isLength: {
		bail: true,
		options: {max: 30},
		errorMessage: "must not exceed 30 characters",
	},
};

export const dateRule = {
	isISO8601: {
		bail: true,
		errorMessage: "Please use ISO 8601 format",
	},
	toDate: true,
	customSanitizer: {
		options: (value: Date) => formatISO(value),
	},
};

/* Special ue case */
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
