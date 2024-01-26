import {checkSchema} from "express-validator";

const commonSchema = {
	isString: true,
	notEmpty: true,
	trim: true,
};

export const signUpValidator = checkSchema({
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
		isEmail: true,
		errorMessage: "Email address is required and must be valid",
	},
	password: {
		notEmpty: true,
		trim: true,
		isLength: {
			options: {min: 8},
			errorMessage: "Password is required and should be at least 8 characters",
		},
	},
});
