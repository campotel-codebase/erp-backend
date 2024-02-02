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
	const getEmployeeWithReports = async (uuid: string): Promise<any> => {
		const employee = await prisma.employee.findUnique({
			where: {
				uuid,
			},
			select: {
				id: true,
				uuid: true,
				jobTitle: true,
				fullName: true,
				EmployeesReportingTo: {
					select: {
						id: true,
						uuid: true,
						jobTitle: true,
						fullName: true,
					},
				},
			},
		});

		if (employee && employee.EmployeesReportingTo.length > 0) {
			const reports = await Promise.all(
				employee.EmployeesReportingTo.map((report) => getEmployeeWithReports(report.uuid)),
			);

			return {
				...employee,
				EmployeesReportingTo: reports,
			};
		} else {
			return employee;
		}
	};

	const selectedChart = await getEmployeeWithReports(employeeUuid);

	return {status: 200, data: selectedChart};
};
