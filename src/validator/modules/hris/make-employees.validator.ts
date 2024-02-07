import {checkSchema} from "express-validator";
import {
	personNameRule,
	commonStringRule,
	emailRule,
	phoneNumberRule,
	dateRule,
} from "../../common.validator";
import {dateSanitizer, objectSanitizer} from "../../custom/sanitizer";
import {
	employeeCheckEmailValidator,
	employeeCheckPhoneNumberValidator,
} from "../../custom/validator";

const makeEmployeesValidator = checkSchema({
	employees: {
		isArray: {
			bail: true,
			errorMessage: "must be a valid array",
		},
	},
	"employees.*.lastName": {...personNameRule},
	"employees.*.firstName": {...personNameRule},
	"employees.*.middleName": {
		optional: {
			options: {
				values: "null",
			},
		},
		notEmpty: true,
		isString: {
			bail: true,
			errorMessage: "field must be a non-empty string",
		},
		trim: true,
		isLength: {
			options: {max: 30},
			errorMessage: "must not exceed 30 characters",
		},
	},
	"employees.*.nickname": {
		optional: {
			options: {
				values: "null",
			},
		},
		notEmpty: true,
		isString: true,
		trim: true,
		errorMessage: "field must be a non-empty string",
	},
	"employees.*.suffix": {
		...commonStringRule,
	},
	"employees.*.email": {
		...emailRule,
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await employeeCheckEmailValidator(value);
				if (isEmailUsed) {
					throw new Error(`email ${isEmailUsed.email} already in used`);
				}
			},
		},
	},
	"employees.*.phoneNumber": {
		...phoneNumberRule,
		custom: {
			options: async (value: string) => {
				const isPhoneNumberUsed = await employeeCheckPhoneNumberValidator(value);
				if (isPhoneNumberUsed) {
					throw new Error(`phone number ${isPhoneNumberUsed.phoneNumber} already in used`);
				}
			},
		},
	},
	"employees.*.birthday": {
		...dateRule,
		customSanitizer: {
			options: (value) => dateSanitizer(value),
		},
	},
	"employees.*.bloodType": {...commonStringRule},
	"employees.*.salary": {...commonStringRule},
	"employees.*.driverLicense": {
		optional: {
			options: {
				values: "null",
			},
		},
		notEmpty: true,
		isString: true,
		trim: true,
		errorMessage: "field must be a non-empty string",
	},
	"employees.*.taxId": {
		...commonStringRule,
	},
	"employees.*.department": {
		...commonStringRule,
	},
	"employees.*.jobTitle": {
		...commonStringRule,
	},
	"employees.*.talentSegment": {
		...commonStringRule,
	},
	"employees.*.hiredDate": {
		...dateRule,
	},
	"employees.*.employmentType": {
		...commonStringRule,
	},
	"employees.*.employeeCompanyId": {
		...commonStringRule,
	},
	"employees.*.benefits": {
		notEmpty: true,
		customSanitizer: {
			options: (value) => objectSanitizer(value),
		},
	},
});

export default makeEmployeesValidator;
