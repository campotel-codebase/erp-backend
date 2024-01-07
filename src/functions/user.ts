import prisma from "../../libs/prisma";
import {signUpType} from "../../types/user";
import {generateJwt} from "../utils/jwt";
import {hashPassword} from "../utils/password";
import {generateUuid} from "../utils/uuid";

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
