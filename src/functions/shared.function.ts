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
