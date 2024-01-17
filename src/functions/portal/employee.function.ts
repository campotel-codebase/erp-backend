import prisma from "../../../libs/prisma";
import {employeeSignInType} from "../../../types/modules/hris/employees";
import {generateJwt} from "../../utils/jwt.util";
import {
	verifyHashedPassword,
	verifyResetUuidForPwd,
	sendResetLinkForPwd,
	hashPassword,
} from "../../utils/password.util";

export const employeeSignIn = async (body: employeeSignInType) => {
	const employeeAccount = await prisma.employee.findUnique({
		where: {email: body.email},
		select: {uuid: true, password: true, isPortalOpen: true},
	});
	if (employeeAccount) {
		if (employeeAccount.isPortalOpen) {
			const isPasswordMatch = await verifyHashedPassword(employeeAccount.password, body.password);
			if (isPasswordMatch) {
				const employee = await prisma.employee.findUnique({
					where: {
						uuid: employeeAccount.uuid,
					},
					include: {Company: {select: {uuid: true}}},
				});
				if (employee) {
					const jwt = generateJwt({companyUuid: employee.Company.uuid, userUuid: employee.uuid});
					if (jwt) {
						return {status: 200, data: jwt};
					} else {
						return {status: 400, data: "fail to generate token"};
					}
				} else {
					return {status: 400, data: "fail to query employee"};
				}
			} else {
				return {status: 401, data: "incorrect password"};
			}
		} else {
			return {status: 403, data: "no access"};
		}
	} else {
		return {status: 404, data: "account not found"};
	}
};
export const employeePwdResetLink = async (email: string) => {
	const isExists = await prisma.employee.findUnique({
		where: {email},
		select: {uuid: true, isPortalOpen: true},
	});
	if (isExists) {
		if (isExists.isPortalOpen) {
			await sendResetLinkForPwd(email, "employee");
			return {status: 200, data: "password reset link was sent to your email address"};
		} else {
			return {status: 403, data: "no access"};
		}
	} else {
		return {status: 404, data: "email not found"};
	}
};
export const employeeResetPwd = async (body: {uuid: string; newPassword: string}) => {
	const {uuid, newPassword} = body;
	const isVerify = await verifyResetUuidForPwd(uuid);
	if (isVerify.result === true) {
		const hashedPassword = await hashPassword(newPassword);
		await prisma.employee.update({
			where: {email: isVerify.email},
			data: {password: hashedPassword},
			select: {uuid: true},
		});
		await prisma.passwordReset.delete({
			where: {uuid},
			select: {uuid: true},
		});
		return {status: 200, data: "password reset successfully"};
	} else {
		return {status: 400, data: "fail to reset password"};
	}
};
