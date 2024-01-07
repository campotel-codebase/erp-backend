import prisma from "../../libs/prisma";

export const setDepartments = async (body: {departments: string}, companyUuid: string) => {
	const newDepartments = await prisma.company.update({
		where: {uuid: companyUuid},
		data: body,
	});
	return {status: 200, data: newDepartments};
};
