import {checkSchema} from "express-validator";
import {commonStringValidator} from "../../shared.validator";
const makeBankAccountValidator = checkSchema({
	bankName: {
		...commonStringValidator,
	},
	accountNumber: {
		...commonStringValidator,
	},
	cardNumber: {
		...commonStringValidator,
	},
	accountType: {
		...commonStringValidator,
	},
});

export default makeBankAccountValidator;
