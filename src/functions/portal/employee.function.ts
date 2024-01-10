import prisma from "../../../libs/prisma";
import {employeeSignInType} from "../../../types/modules/hris/employees";
import {
	verifyHashedPassword,
	verifyResetUuidForPwd,
	sendResetLinkForPwd,
} from "../../utils/password.util";

export const employeeSignIn = async (body: employeeSignInType) => {
	return {status: 404, data: ""};
};
export const employeePwdResetLink = async (email: string) => {
	const isExists = await prisma.employee.findUnique({
		where: {email},
		select: {uuid: true},
	});
	if (isExists) {
		await sendResetLinkForPwd(email, "employee");
		return {status: 200, data: "password reset link was sent to your email address"};
	} else {
		return {status: 404, data: "email not found"};
	}
};
export const employeeResetPwd = async (body: {uuid: string; newPassword: string}) => {
	return {status: 404, data: ""};
};
