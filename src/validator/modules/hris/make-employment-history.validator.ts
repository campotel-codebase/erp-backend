import {checkSchema} from "express-validator";
import {dateSanitizer} from "../../custom/sanitizer";
import {commonStringRule, dateRule} from "../../shared.validator";

const makeEmploymentHistoryValidator = checkSchema({
	offBoarding: {
		...dateRule,
		customSanitizer: {
			options: (value) => dateSanitizer(value),
		},
	},
	reason: {...commonStringRule},
	remarks: {...commonStringRule},
});

export default makeEmploymentHistoryValidator;
