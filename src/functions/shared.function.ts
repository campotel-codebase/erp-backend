import prisma from "../../libs/prisma";

export const getEmployee = async (employeeUuid: string) => {
	const employee = await prisma.employee.findUnique({
		where: {uuid: employeeUuid},
		include: {
			ReportingTo: {select: {fullName: true}},
			EmployeesReportingTo: {select: {fullName: true}},
		},
	});
	return {status: 200, data: employee};
};

export const findEmployee = async (
	companyUuid: string,
	keyword: any, //TODO define keyword type
) => {
	const employees = await prisma.company.findMany({
		where: {
			uuid: companyUuid,
		},
		select: {
			Employee: {
				where: {
					fullName: {
						contains: keyword,
					},
				},
				take: 5,
				orderBy: {
					createdAt: "desc",
				},
			},
		},
	});
	return {status: 200, data: employees};
};
