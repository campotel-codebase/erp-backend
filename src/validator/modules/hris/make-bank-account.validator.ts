import {checkSchema} from "express-validator";
import {
	personNameRule,
	commonStringRule,
	emailRule,
	phoneNumberRule,
	dateRule,
} from "../../shared.validator";
const makeBankAccountValidator = checkSchema({
	bankName: {
		...commonStringRule,
	},
	accountNumber: {
		...commonStringRule,
	},
	cardNumber: {
		...commonStringRule,
	},
	accountType: {
		...commonStringRule,
	},
});

export default makeBankAccountValidator;
