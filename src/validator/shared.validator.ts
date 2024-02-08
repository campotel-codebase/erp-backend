import {checkSchema, query} from "express-validator";
import {checkResetPasswordUuidValidator} from "./custom/validator";

export const commonStringValidator = {
	notEmpty: {
		bail: true,
		errorMessage: "this field is required",
	},
	isString: {
		errorMessage: "this field must be a type of string",
	},
	trim: true,
};

export const personNameValidator = {
	notEmpty: {
		bail: true,
		errorMessage: "this field is required",
	},
	isString: {
		bail: true,
		errorMessage: "this field must be a type of string",
	},
	trim: true,
	isLength: {
		options: {max: 30},
		errorMessage: "must not exceed 100 characters",
	},
};

export const passwordValidator = {
	...commonStringValidator,
	isLength: {
		options: {min: 8},
		errorMessage: "value is required and should be at least 8 characters",
	},
};

export const emailValidator = {
	trim: true,
	isEmail: {
		bail: true,
		errorMessage: "must be a valid email",
	},
	isLength: {
		bail: true,
		options: {max: 100},
		errorMessage: "must not exceed 100 characters",
	},
};

export const phoneNumberValidator = {
	notEmpty: {
		bail: true,
		errorMessage: "this field is required",
	},
	isString: {
		bail: true,
		errorMessage: "this field must be a type of string",
	},
	trim: true,
	isLength: {
		bail: true,
		options: {max: 30},
		errorMessage: "must not exceed 30 characters",
	},
};

export const dateValidator = {
	isISO8601: {
		bail: true,
		errorMessage: "Please use ISO 8601 format",
	},
	toDate: true,
};

export const queryValidator = query("keyword")
	.notEmpty()
	.trim()
	.withMessage("valid keyword value is required");

/* Special ue case */
export const resetPasswordVS = checkSchema({
	newPassword: passwordValidator,
	passwordResetUuid: {
		...commonStringValidator,
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
