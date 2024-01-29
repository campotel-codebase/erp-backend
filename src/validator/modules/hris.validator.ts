import {checkSchema} from "express-validator";
import {commonStringRule, dateRule} from "../common.validator";
import {formatISO} from "date-fns";
import {employeeCheckEmailValidator, employeeCheckPhoneNumberValidator} from "../custom.validator";

export const makeEmployeeVS = checkSchema({
	"employee.lastName": {
		...commonStringRule,
		errorMessage: "Last Name is required and must be valid",
	},
	"employee.firstName": {
		...commonStringRule,
		errorMessage: "First Name is required and must be valid",
	},
	"employee.middleName": {
		optional: true,
		isString: true,
		trim: true,
		errorMessage: "Middle Name is required and must be valid",
	},
	"employee.nickname": {
		optional: true,
		isString: true,
		trim: true,
		errorMessage: "Nickname is required and must be valid",
	},
	"employee.suffix": {
		...commonStringRule,
		errorMessage: "Suffix is required and must be valid",
	},
	"employee.email": {
		custom: {
			options: async (value: string) => {
				const isEmailUsed = await employeeCheckEmailValidator(value);
				if (isEmailUsed) {
					throw new Error("E-mail already in use");
				}
			},
		},
		isEmail: true,
		errorMessage: "Email address is required and must be valid",
	},
	"employee.phoneNumber": {
		custom: {
			options: async (value: string) => {
				const isPhoneNumberUsed = await employeeCheckPhoneNumberValidator(value);
				if (isPhoneNumberUsed) {
					throw new Error("Phone-Number already in use");
				}
			},
		},
		...commonStringRule,
		errorMessage: "Phone-Number is required and must be valid",
	},
	"employee.birthday": {
		...dateRule,
		customSanitizer: {
			options: (value) => formatISO(value),
		},
		errorMessage: "Birthday is required and must be valid",
	},
	"employee.bloodType": {
		...commonStringRule,
		errorMessage: "Blood Type is required and must be valid",
	},
	"employee.salary": {
		...commonStringRule,
		errorMessage: "Salary is required and must be valid",
	},
	"employee.driverLicense": {
		...commonStringRule,
		errorMessage: "Driver License is required and must be valid",
	},
	"employee.taxId": {
		...commonStringRule,
		errorMessage: "Tax Id is required and must be valid",
	},
	"employee.department": {
		...commonStringRule,
		errorMessage: "Departments is required and must be valid",
	},
	"employee.jobTitle": {
		...commonStringRule,
		errorMessage: "JobTitle is required and must be valid",
	},
	"employee.talentSegment": {
		...commonStringRule,
		errorMessage: "TalentSegment is required and must be valid",
	},
	"employee.hiredDate": {
		...dateRule,
		errorMessage: "Hired Date is required and must be valid",
	},
	"employee.benefits": {
		notEmpty: true,
		customSanitizer: {
			options: (value) => JSON.stringify(value),
		},
		errorMessage: "Benefits is required and must be valid",
	},
	reportingToId: {
		isInt: true,
		toInt: true,
		errorMessage: "Reporting To Id is required and must be valid",
	},
});
