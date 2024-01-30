import {checkSchema} from "express-validator";
import {
	commonStringRule,
	dateRule,
	emailRule,
	personNameRule,
	phoneNumberRule,
} from "../common.validator";
import {formatISO} from "date-fns";
import {employeeCheckEmailValidator, employeeCheckPhoneNumberValidator} from "../custom.validator";

export const makeEmployeeVS = checkSchema({
	"employee.lastName": {
		...personNameRule,
	},
	"employee.firstName": {
		...personNameRule,
	},
	"employee.middleName": {
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
	"employee.nickname": {
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
	"employee.suffix": {
		...commonStringRule,
	},
	"employee.email": {
		...emailRule,
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await employeeCheckEmailValidator(value);
				if (isEmailUsed) {
					throw new Error("email already in use");
				}
			},
		},
	},
	"employee.phoneNumber": {
		...phoneNumberRule,
		custom: {
			options: async (value: string) => {
				const isPhoneNumberUsed = await employeeCheckPhoneNumberValidator(value);
				if (isPhoneNumberUsed) {
					throw new Error("phone number already in use");
				}
			},
		},
	},
	"employee.birthday": {
		...dateRule,
		customSanitizer: {
			options: (value) => formatISO(value),
		},
	},
	"employee.bloodType": {
		...commonStringRule,
	},
	"employee.salary": {
		...commonStringRule,
	},
	"employee.driverLicense": {
		trim: true,
		optional: {
			options: {
				values: "null",
			},
		},
		notEmpty: true,
		isString: true,
		errorMessage: "field must be a non-empty string",
	},
	"employee.taxId": {
		...commonStringRule,
	},
	"employee.department": {
		...commonStringRule,
	},
	"employee.jobTitle": {
		...commonStringRule,
	},
	"employee.talentSegment": {
		...commonStringRule,
	},
	"employee.hiredDate": {
		...dateRule,
	},
	"employee.employmentType": {
		...commonStringRule,
	},
	"employees.employeeCompanyId": {
		...commonStringRule,
	},
	"employee.benefits": {
		notEmpty: true,
		customSanitizer: {
			options: (value) => JSON.stringify(value),
		},
	},
	reportingToId: {
		notEmpty: {
			bail: true,
		},
		isInt: true,
		toInt: true,
	},
});

export const makeEmployeesVS = checkSchema({
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
			options: (value) => formatISO(value),
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
			options: (value) => JSON.stringify(value),
		},
	},
});
