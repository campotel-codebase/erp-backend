import {parse} from "csv-parse";
import prisma from "../../../libs/prisma";
import {generateUuid} from "../../utils/uuid.util";
import {formatISO} from "date-fns";
import {offBoardType, onBoardType} from "../../../types/modules/hris/employees";
import {bankAccountType} from "../../../types/modules/hris/payroll";
import {Prisma} from "@prisma/client";
import pwdGenerator from "generate-password";
import {hashPassword} from "../../utils/password.util";

export const employeesCsvToJsonArray = async (csvBuffer: string, companyUuid: string) => {
	const company = await prisma.company.findUnique({
		where: {uuid: companyUuid},
		select: {benefits: true},
	});

	const benefitsToArray: string[] = JSON.parse(company?.benefits ? company.benefits : "[]");
	const expectedHeader = [
		"lastName",
		"firstName",
		"middleName",
		"suffix",
		"phoneNumber",
		"nickname",
		"email",
		"birthday",
		"bloodType",
		"driverLicense",
		"taxId",
		...benefitsToArray,
	];

	const parseCsv = await new Promise((resolve, reject) => {
		parse(
			csvBuffer,
			{
				columns: true,
				delimiter: ",",
				skip_empty_lines: true,
				skip_records_with_empty_values: true,
				on_record: (record, lines: any) => {
					const csvHeaders = lines.columns.map((column: {name: string}) => column.name);

					// INFO - compare headers
					const isHeaderValid =
						csvHeaders.length === expectedHeader.length &&
						csvHeaders.every((value: string) => expectedHeader.includes(value));
					if (!isHeaderValid) {
						return {status: 400, data: "invalid csv header"};
					}

					// INFO - Convert empty strings to null
					Object.keys(record).forEach((key) => {
						if (record[key] === "") {
							record[key] = null;
						}
					});

					record.fullName = `${record.lastName} ${record.middleName} ${record.firstName}`;
					return record;
				},
			},
			(err: any, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			},
		);
	});
	return {status: 200, data: parseCsv};
};

export const createEmployee = async (body: Prisma.EmployeeCreateInput, companyUuid: string) => {
	const company = await prisma.company.findUnique({
		where: {uuid: companyUuid},
		select: {id: true},
	});
	if (company) {
		const fullName = `${body.lastName} ${body.firstName} ${body.middleName}`;
		const {department, jobTitle, talentSegment, benefits, ...rest} = body;
		const benefitsToString = JSON.stringify(benefits);
		const generatedPassword = pwdGenerator.generate({
			length: 10,
			numbers: true,
			symbols: true,
			strict: true,
		});

		const newEmployee = await prisma.employee.create({
			data: {
				...rest,
				fullName,
				department,
				jobTitle,
				talentSegment,
				benefits: benefitsToString,
				password: await hashPassword(generatedPassword),
				uuid: await generateUuid(),
				Company: {connect: {id: company.id}},
			},
		});
		return {status: 200, data: {newEmployee, generatedPassword}};
	} else {
		return {status: 404, data: "company not found"};
	}
};

export const createEmployees = async (body: [], companyUuid: string) => {};

export const onboardEmployee = async (
	body: onBoardType,
	employeeUuid: string,
	companyUuid: string,
) => {
	const {reportingToId, hiredDate, ...rest} = body;
	const company = await prisma.company.findUnique({
		where: {uuid: companyUuid},
		select: {
			Employee: {
				where: {uuid: employeeUuid, isActive: 0},
			},
		},
	});
	if (company?.Employee[0]) {
		const newBoardedEmployee = await prisma.employee.update({
			where: {uuid: employeeUuid},
			data: {
				...rest,
				hiredDate: formatISO(hiredDate),
				lastHiredDate: formatISO(hiredDate),
				isActive: 1,
				ReportingTo: {
					connect: {id: reportingToId},
				},
			},
		});
		return {status: 200, data: newBoardedEmployee};
	} else {
		return {status: 404, data: "employee not found"};
	}
};

export const offboardEmployee = async (
	body: offBoardType,
	employeeUuid: string,
	companyUuid: string,
) => {
	const company = await prisma.company.findUnique({
		where: {uuid: companyUuid},
		select: {
			id: true,
			Employee: {
				where: {uuid: employeeUuid, isActive: 1},
			},
		},
	});
	if (company?.Employee[0]) {
		const newOffBoardedEmployee = await prisma.employee.update({
			where: {uuid: company.Employee[0].uuid},
			data: {
				isPortalOpen: 0,
				isActive: 0,
			},
			select: {id: true, hiredDate: true},
		});
		await prisma.bankAccount.updateMany({
			where: {
				employeeId: newOffBoardedEmployee.id,
			},
			data: {
				isActive: 0,
			},
		});
		if (newOffBoardedEmployee.hiredDate) {
			await prisma.employmentHistory.create({
				data: {
					offBoarding: formatISO(body.offBoarding),
					onBoarding: newOffBoardedEmployee.hiredDate,
					reason: body.reason,
					remarks: body.remarks,
					Employee: {
						connect: {id: newOffBoardedEmployee.id},
					},
					Company: {
						connect: {id: company.id},
					},
				},
			});
			return {status: 200, data: "employee offboarded successfully"};
		} else {
			return {status: 400, data: "employee hired date is not define"};
		}
	} else {
		return {status: 404, data: "employee not found"};
	}
};

export const createBankAccount = async (body: bankAccountType, companyUuid: string) => {
	const company = await prisma.company.findUnique({
		where: {uuid: companyUuid},
		select: {id: true},
	});
	if (company) {
		const newBankAccount = await prisma.bankAccount.create({
			data: {
				...body,
				uuid: await generateUuid(),
				Company: {
					connect: {id: company.id},
				},
			},
		});
		return {status: 200, data: newBankAccount};
	} else {
		return {status: 404, data: "company not found"};
	}
};

export const assignBankAccount = async (
	employeeUuid: string,
	bankAccountUuid: string,
	companyUuid: string,
) => {
	const company = await prisma.company.findUnique({
		where: {uuid: companyUuid},
		select: {
			Employee: {
				where: {uuid: employeeUuid, isActive: 1},
			},
			BankAccount: {
				where: {
					uuid: bankAccountUuid,
					isActive: 0,
					employeeId: null,
				},
			},
		},
	});
	if (company?.Employee[0] && company?.BankAccount[0]) {
		const newPayrollForEmployee = await prisma.employee.update({
			where: {uuid: employeeUuid},
			data: {
				payType: "atm",
			},
			select: {id: true, payType: true},
		});
		const assignBank = await prisma.bankAccount.update({
			where: {uuid: bankAccountUuid},
			data: {
				isActive: 1,
				Employee: {
					connect: {
						id: newPayrollForEmployee.id,
					},
				},
			},
		});
		return {status: 200, data: {newPayrollForEmployee, assignBank}};
	} else {
		return {status: 400, data: "invalid request"};
	}
};

export const employees = async (companyUuid: string) => {
	const employees = await prisma.company.findMany({
		where: {
			uuid: companyUuid,
		},
		select: {
			Employee: true,
		},
	});
	return {status: 200, data: employees};
};

export const searchEmployee = async (companyUuid: string, keyword: any) => {
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

export const employee = async (companyUuid: string, employeeUuid: string) => {
	const employee = await prisma.company.findUnique({
		where: {uuid: companyUuid},
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

export const orgChartTree = async (companyUuid: string, employeeUuid: string) => {
	const company = await prisma.company.findUnique({
		where: {uuid: companyUuid},
		select: {id: true},
	});

	if (company) {
		// TODO Needs to fetch if  the reporting to is not null
		const selectedChart = await prisma.employee.findUnique({
			where: {
				companyId: company.id,
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
	} else {
		return {status: 404, data: "Company not found"};
	}
};
