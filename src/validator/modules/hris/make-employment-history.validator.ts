import {checkSchema} from "express-validator";
import {dateSanitizer} from "../../custom/sanitizer";
import {commonStringValidator, dateValidator} from "../../shared.validator";

const makeEmploymentHistoryValidator = checkSchema({
	offBoarding: {
		...dateValidator,
		customSanitizer: {
			options: (value) => dateSanitizer(value),
		},
	},
	reason: {...commonStringValidator},
	remarks: {...commonStringValidator},
});

export default makeEmploymentHistoryValidator;
