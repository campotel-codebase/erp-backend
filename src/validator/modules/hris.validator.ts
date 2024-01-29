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
		optional: true,
		isString: true,
		trim: true,
		isLength: {
			bail: true,
			options: {max: 30},
			errorMessage: "must not exceed 100 characters",
		},
	},
	"employee.nickname": {
		optional: true,
		isString: true,
		trim: true,
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
