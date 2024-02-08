import {checkSchema} from "express-validator";
import {
	personNameValidator,
	commonStringValidator,
	emailValidator,
	phoneNumberValidator,
	dateValidator,
} from "../../shared.validator";
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
	"employees.*.lastName": {...personNameValidator},
	"employees.*.firstName": {...personNameValidator},
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
		...commonStringValidator,
	},
	"employees.*.email": {
		...emailValidator,
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
		...phoneNumberValidator,
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
		...dateValidator,
		customSanitizer: {
			options: (value) => dateSanitizer(value),
		},
	},
	"employees.*.bloodType": {...commonStringValidator},
	"employees.*.salary": {...commonStringValidator},
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
		...commonStringValidator,
	},
	"employees.*.department": {
		...commonStringValidator,
	},
	"employees.*.jobTitle": {
		...commonStringValidator,
	},
	"employees.*.talentSegment": {
		...commonStringValidator,
	},
	"employees.*.hiredDate": {
		...dateValidator,
		customSanitizer: {
			options: (value) => dateSanitizer(value),
		},
	},
	"employees.*.employmentType": {
		...commonStringValidator,
	},
	"employees.*.employeeCompanyId": {
		...commonStringValidator,
	},
	"employees.*.benefits": {
		notEmpty: true,
		customSanitizer: {
			options: (value) => objectSanitizer(value),
		},
	},
});

export default makeEmployeesValidator;
