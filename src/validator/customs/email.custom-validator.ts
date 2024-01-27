import prisma from "../../../libs/prisma";

export const userCheckEmailValidator = async (value: string) => {
	return await prisma.user.findUnique({
		where: {email: value},
		select: {email: true},
	});
};
