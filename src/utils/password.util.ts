import prisma from "../../libs/prisma";
import argon2 from "argon2";
import {addHours, formatISO} from "date-fns";
import {generateUuid} from "./uuid.util";
import pwdGenerator from "generate-password";
import { emailContent } from "./email.util";

export const sendResetLinkForPwd = async (email: string, usedFor: string) => {
	const twoHoursFromNow = formatISO(addHours(new Date(), 2));
	const uuid = await generateUuid();
	const isStored = await prisma.passwordReset.create({
		data: {
			email,
			uuid,
			expiresAt: twoHoursFromNow,
		},
	});
	if (isStored) {
		const client = `http://localhost:4200/${usedFor}/reset-password`;
		const resetLink = `${client}/${uuid}`;
		const sendTo = {
			to: email,
			subject: "password reset",
			text: {
				title: "dear user click this link to reset password",
				msg: resetLink,
			},
		};
		const {envelope} = await emailContent(sendTo);
		return envelope;
	}
};

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

export const generatePassword = pwdGenerator.generate({
	length: 10,
	numbers: true,
	symbols: true,
	strict: true,
});
