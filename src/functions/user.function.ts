import prisma from "../../libs/prisma";
import {signInType, signUpType} from "../../types/user";
import {generateJwt} from "../utils/jwt.util";
import {hashPassword, sendResetLinkForPwd, verifyHashedPassword} from "../utils/password.util";
import {generateUuid} from "../utils/uuid.util";

export const signUp = async (body: signUpType) => {
	const isEmailExists = await prisma.user.findUnique({
		where: {email: body.email},
		select: {id: true},
	});
	if (isEmailExists) {
		return {status: 409, data: "email already in use"};
	} else {
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
	}
};

export const signIn = async (body: signInType) => {
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
	const isExists = await prisma.user.findUnique({
		where: {email},
		select: {uuid: true},
	});
	if (isExists) {
		await sendResetLinkForPwd(email, "user");
		return {status: 200, data: "password reset link was sent to your email address"};
	} else {
		return {status: 404, data: "email not found"};
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
