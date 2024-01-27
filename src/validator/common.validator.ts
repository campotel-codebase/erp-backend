export const commonStringRule = {
	isString: true,
	notEmpty: true,
	trim: true,
};

export const passwordRule = {
	...commonStringRule,
	isLength: {
		options: {min: 8},
		errorMessage: "Password is required and should be at least 8 characters",
	},
};
