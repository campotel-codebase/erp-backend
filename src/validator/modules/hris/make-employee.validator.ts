import {checkSchema} from "express-validator";
import {
	personNameRule,
	commonStringRule,
	emailRule,
	phoneNumberRule,
	dateRule,
} from "../../shared.validator";
import {dateSanitizer, objectSanitizer} from "../../custom/sanitizer";
import {
	employeeCheckEmailValidator,
	employeeCheckPhoneNumberValidator,
} from "../../custom/validator";

const makeEmployeeValidator = checkSchema({
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
			options: (value) => dateSanitizer(value),
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
	"employee.employeeCompanyId": {
		...commonStringRule,
	},
	"employee.benefits": {
		notEmpty: true,
		customSanitizer: {
			options: (value) => objectSanitizer(value),
		},
	},
	reportingToUuid: {
		...commonStringRule,
	},
});

export default makeEmployeeValidator;
