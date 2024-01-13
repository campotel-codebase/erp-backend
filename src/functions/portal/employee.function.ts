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
	const userAccount = await prisma.employee.findUnique({
		where: {email: body.email},
		select: {uuid: true, password: true, isPortalOpen: true},
	});
	if (userAccount) {
		if (userAccount.isPortalOpen) {
			const isPasswordMatch = await verifyHashedPassword(userAccount.password, body.password);
			if (isPasswordMatch) {
				const user = await prisma.employee.findUnique({
					where: {
						uuid: userAccount.uuid,
					},
					include: {Company: {select: {uuid: true}}},
				});
				if (user) {
					const jwt = generateJwt({companyUuid: user.Company.uuid, userUuid: user.uuid});
					if (jwt) {
						return {status: 200, data: jwt};
					} else {
						return {status: 400, data: "fail to generate token"};
					}
				} else {
					return {status: 400, data: "fail to query user"};
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
