import prisma from "../../libs/prisma";
import argon2 from "argon2";

export const hashPassword = async (valueToHash: string) => {
	return await argon2.hash(valueToHash);
};

export const verifyHashedPassword = async (hashedPassword: string, password: string) => {
	return await argon2.verify(hashedPassword, password);
};

export const verifyResetUuidForPwd = async (uuid: string) => {
	const reset = await prisma.passwordReset.findUnique({
		where: {
			uuid,
		},
	});
	if (reset) {
		const currentTimestamp = new Date();

		if (reset.expiresAt > currentTimestamp) {
			return {result: true, email: reset.email};
		} else {
			throw new Error("request is expired please request a new one");
		}
	} else {
		throw new Error("invalid link");
	}
};
