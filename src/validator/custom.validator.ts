import prisma from "../../libs/prisma";

export const userCheckEmailValidator = async (value: string) => {
	return await prisma.user.findUnique({
		where: {email: value},
		select: {email: true},
	});
};

export const userCheckResetPasswordUuidValidator = async (value: string) => {
	return await prisma.passwordReset.findUnique({
		where: {uuid: value},
		select: {uuid: true},
	});
};

/* Employee */
export const employeeCheckEmailValidator = async (value: string) => {
	return await prisma.employee.findUnique({
		where: {email: value},
		select: {email: true},
	});
};
