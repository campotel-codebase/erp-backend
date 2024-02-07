import prisma from "../../../libs/prisma";

/* Common */
export const checkResetPasswordUuidValidator = async (value: string) => {
	try {
		return await prisma.passwordReset.findUnique({
			where: {uuid: value},
			select: {uuid: true},
		});
	} catch (error: any) {
		throw new Error(error);
	}
};
/* Common */

/* User */
export const userCheckEmailValidator = async (value: string) => {
	try {
		return await prisma.user.findUnique({
			where: {email: value},
			select: {email: true},
		});
	} catch (error: any) {
		throw new Error(error);
	}
};
/* User */

/* Employee */
export const employeeCheckEmailValidator = async (value: string) => {
	try {
		return await prisma.employee.findUnique({
			where: {email: value},
			select: {email: true},
		});
	} catch (error: any) {
		throw new Error(error);
	}
};
export const employeeCheckPhoneNumberValidator = async (value: string) => {
	try {
		return await prisma.employee.findUnique({
			where: {phoneNumber: value},
			select: {phoneNumber: true},
		});
	} catch (error: any) {
		throw new Error(error);
	}
};
/* Employee */
