import {checkSchema} from "express-validator";
import {
	commonStringRule,
	dateRule,
	emailRule,
	personNameRule,
	phoneNumberRule,
} from "../common.validator";
import {formatISO} from "date-fns";
import {
	employeeCheckEmailValidator,
	employeeCheckPhoneNumberValidator,
	optionalStringValidator,
} from "../custom.validator";

export const makeEmployeeVS = checkSchema({
	"employee.lastName": {
		...personNameRule,
	},
	"employee.firstName": {
		...personNameRule,
	},
	"employee.middleName": {
		trim: true,
		optional: {
			options: {
				values: "null",
			},
		},
		custom: {
			bail: true,
			options: (value) => optionalStringValidator(value),
		},
		isLength: {
			bail: true,
			options: {max: 30},
			errorMessage: "must not exceed 30 characters",
		},
	},
	"employee.nickname": {
		trim: true,
		optional: {
			options: {
				values: "null",
			},
		},
		custom: {
			bail: true,
			options: (value) => optionalStringValidator(value),
		},
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
					throw new Error("already in use");
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
					throw new Error("already in use");
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
		...commonStringRule,
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
	"employee.benefits": {
		notEmpty: true,
		customSanitizer: {
			options: (value) => JSON.stringify(value),
		},
	},
	reportingToId: {
		isInt: true,
		toInt: true,
	},
});
