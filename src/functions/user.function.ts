import {Prisma} from "@prisma/client";
import prisma from "../../libs/prisma";
import {userSignInType, userSignUpType} from "../../types/user";
import {generateJwt} from "../utils/jwt.util";
import {
	hashPassword,
	sendResetLinkForPwd,
	verifyHashedPassword,
	verifyResetUuidForPwd,
} from "../utils/password.util";
import {generateUuid} from "../utils/uuid.util";

export const userSignUp = async (body: userSignUpType) => {
	const newUser = await prisma.company.create({
		data: {
			uuid: await generateUuid(),
			name: body.companyName,
			User: {
				create: {
					uuid: await generateUuid(),
					lastName: body.lastName,
					firstName: body.firstName,
					email: body.email,
					password: await hashPassword(body.password),
				},
			},
		},
		include: {User: true},
	});
	const jwt = generateJwt({companyUuid: newUser.uuid, userUuid: newUser.User[0].uuid});
	if (jwt) {
		return {status: 200, data: jwt};
	} else {
		return {status: 400, data: "fail to generate token"};
	}
};

export const userSignIn = async (body: userSignInType) => {
	const userAccount = await prisma.user.findUnique({
		where: {email: body.email},
		select: {uuid: true, password: true},
	});
	if (userAccount) {
		const isPasswordMatch = await verifyHashedPassword(userAccount.password, body.password);
		if (isPasswordMatch) {
			const user = await prisma.user.findUnique({
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
		return {status: 404, data: "account not found"};
	}
};

export const userPwdResetLink = async (email: string) => {
	await sendResetLinkForPwd(email, "user");
	return {status: 200, data: "password reset link was sent to your email address"};
};

export const userResetPwd = async (body: {uuid: string; newPassword: string}) => {
	const {uuid, newPassword} = body;
	const isVerify = await verifyResetUuidForPwd(uuid);
	if (isVerify.result === true) {
		const hashedPassword = await hashPassword(newPassword);
		await prisma.user.update({
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

export const profile = async (uuid: string) => {
	const profile = await prisma.user.findUnique({
		where: {uuid},
	});
	if (profile) {
		const {id, password, ...rest} = profile;
		return {status: 200, data: rest};
	} else {
		return {status: 404, data: "user not found"};
	}
};

export const updateProfile = async (body: Prisma.UserUpdateInput, currentUserUuid: string) => {
	const updatedUser = await prisma.user.update({
		where: {uuid: currentUserUuid},
		data: body,
	});
	return {status: 200, data: updatedUser};
};

export const updateAvatar = async (imgSrc: string, currentUserUuid: string) => {
	const newAvatar = await prisma.user.update({
		where: {uuid: currentUserUuid},
		data: {avatar: imgSrc},
		select: {avatar: true},
	});
	return {status: 200, data: "avatar updated successfully"};
};
