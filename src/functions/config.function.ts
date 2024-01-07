import prisma from "../../libs/prisma";

export const setDepartments = async (body: {departments: string}, companyUuid: string) => {
	const newDepartments = await prisma.company.update({
		where: {uuid: companyUuid},
		data: body,
	});
	return {status: 200, data: newDepartments};
};

export const setJobTitles = async (body: {jobTitles: string}, companyUuid: string) => {
	const newJobTitles = await prisma.company.update({
		where: {uuid: companyUuid},
		data: body,
	});
	return {status: 200, data: newJobTitles};
};

export const setTalentSegments = async (body: {talentSegments: string}, companyUuid: string) => {
	const newTalentSegments = await prisma.company.update({
		where: {uuid: companyUuid},
		data: body,
	});
	return {status: 200, data: newTalentSegments};
};

export const setBenefits = async (body: {benefits: string}, companyUuid: string) => {
	const newBenefits = await prisma.company.update({
		where: {uuid: companyUuid},
		data: body,
	});
	return {status: 200, data: newBenefits};
};
