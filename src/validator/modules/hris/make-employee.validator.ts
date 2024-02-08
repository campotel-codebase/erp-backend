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

const makeEmployeeValidator = checkSchema({
	"employee.lastName": {
		...personNameValidator,
	},
	"employee.firstName": {
		...personNameValidator,
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
		...commonStringValidator,
	},
	"employee.email": {
		...emailValidator,
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
		...phoneNumberValidator,
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
		...dateValidator,
		customSanitizer: {
			options: (value) => dateSanitizer(value),
		},
	},
	"employee.bloodType": {
		...commonStringValidator,
	},
	"employee.salary": {
		...commonStringValidator,
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
		...commonStringValidator,
	},
	"employee.department": {
		...commonStringValidator,
	},
	"employee.jobTitle": {
		...commonStringValidator,
	},
	"employee.talentSegment": {
		...commonStringValidator,
	},
	"employee.hiredDate": {
		...dateValidator,
		customSanitizer: {
			options: (value) => dateSanitizer(value),
		},
	},
	"employee.employmentType": {
		...commonStringValidator,
	},
	"employee.employeeCompanyId": {
		...commonStringValidator,
	},
	"employee.benefits": {
		notEmpty: true,
		customSanitizer: {
			options: (value) => objectSanitizer(value),
		},
	},
	reportingToUuid: {
		...commonStringValidator,
	},
});

export default makeEmployeeValidator;
