import prisma from "../../../../libs/prisma";
import {userAuthCredentialsType} from "../../../../types/jwt-payload";

export const getEmployees = async (company: userAuthCredentialsType["company"]) => {
	const employees = await prisma.company.findMany({
		where: {
			uuid: company.uuid,
		},
		select: {
			Employee: true,
		},
	});
	return {status: 200, data: employees};
};

export const getEmployee = async (
	company: userAuthCredentialsType["company"],
	employeeUuid: string,
) => {
	const employee = await prisma.company.findUnique({
		where: {uuid: company.uuid},
		select: {
			Employee: {
				where: {
					uuid: employeeUuid,
				},
				include: {
					ReportingTo: {select: {fullName: true}},
					EmployeesReportingTo: {select: {fullName: true}},
				},
			},
		},
	});
	return {status: 200, data: employee};
};

export const findEmployee = async (
	company: userAuthCredentialsType["company"],
	keyword: any, //TODO define keyword type
) => {
	const employees = await prisma.company.findMany({
		where: {
			uuid: company.uuid,
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

export const getOrgChart = async (employeeUuid: string) => {
	// TODO Needs to fetch if  the reporting to is not null
	const selectedChart = await prisma.employee.findUnique({
		where: {
			uuid: employeeUuid,
		},
		// CEO
		select: {
			id: true,
			uuid: true,
			jobTitle: true,
			fullName: true,
			// Managers
			EmployeesReportingTo: {
				select: {
					id: true,
					uuid: true,
					jobTitle: true,
					fullName: true,
					// Group Leaders
					EmployeesReportingTo: {
						select: {
							id: true,
							uuid: true,
							jobTitle: true,
							fullName: true,
							// Team Leaders
							EmployeesReportingTo: {
								select: {
									id: true,
									uuid: true,
									jobTitle: true,
									fullName: true,
								},
							},
						},
					},
				},
			},
		},
	});

	return {status: 200, data: selectedChart};
};
