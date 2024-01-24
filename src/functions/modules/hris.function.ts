import {parse} from "csv-parse";
import prisma from "../../../libs/prisma";
import {generateUuid} from "../../utils/uuid.util";
import {formatISO} from "date-fns";
import {offBoardType} from "../../../types/modules/hris/employees";
import {bankAccountType} from "../../../types/modules/hris/payroll";
import {Prisma} from "@prisma/client";
import {generatePassword, hashPassword} from "../../utils/password.util";
import {userAuthCredentialsType} from "../../../types/jwt-payload";
import {emailContent} from "../../utils/email.util";
import {calculateTenure} from "../../utils/tenure.util";

export const employeesCsvToJsonArray = async (
	csvBuffer: string,
	companyBenefits: string | null,
) => {
	const benefitsToArray: string[] = JSON.parse(companyBenefits ? companyBenefits : "[]");
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

export const onboardEmployee = async (
	body: {employee: Prisma.EmployeeCreateInput; reportingToId: number},
	company: userAuthCredentialsType["company"],
) => {
	const fullName = `${body.employee.lastName} ${body.employee.firstName} ${body.employee.middleName}`;
	const {benefits, hiredDate, ...rest} = body.employee;
	const benefitsToString = JSON.stringify(benefits);
	const tempPassword = generatePassword;

	const newEmployee = await prisma.employee.create({
		data: {
			...rest,
			fullName,
			hiredDate: formatISO(hiredDate),
			lastHiredDate: formatISO(hiredDate),
			benefits: benefitsToString,
			password: await hashPassword(tempPassword),
			uuid: await generateUuid(),
			Company: {connect: {id: company.id}},
			ReportingTo: {
				connect: {id: body.reportingToId},
			},
		},
	});
	const sendTo = {
		to: newEmployee.email,
		subject: "newly hired",
		text: {
			title: `Welcome ${newEmployee.fullName} to ${company.name}`,
			msg: `temporary erp portal password: ${tempPassword}`,
		},
		usedFor: "notification",
	};
	await emailContent(sendTo);
	return {status: 200, data: {newEmployee, tempPassword}};
};

export const onBoardEmployees = async (
	body: Prisma.EmployeeCreateManyInput[],
	company: userAuthCredentialsType["company"],
) => {
	const employees = await Promise.all(
		body.map(async (employee: Prisma.EmployeeCreateManyInput) => {
			const {department, jobTitle, talentSegment, benefits, hiredDate, ...rest} = employee;
			const fullName = `${employee.lastName} ${employee.firstName} ${employee.middleName}`;
			const benefitsToString = JSON.stringify(benefits);
			return {
				...rest,
				companyId: company.id,
				fullName,
				hiredDate,
				lastHiredDate: formatISO(hiredDate),
				benefits: benefitsToString,
				uuid: await generateUuid(),
				password: generatePassword,
			};
		}),
	);
	const hashPasswords = await Promise.all(
		employees.map(async (employee: Prisma.EmployeeCreateManyInput) => {
			const {password, ...rest} = employee;
			return {
				...rest,
				password: await hashPassword(password),
			};
		}),
	);
	const newEmployees = await prisma.employee.createMany({
		data: hashPasswords,
	});
	employees.forEach(async (employee: Prisma.EmployeeCreateManyInput) => {
		const {fullName, password, email, ...rest} = employee;
		const sendTo = {
			to: email,
			subject: "newly hired",
			text: {
				title: `Welcome ${fullName} to ${company.name}`,
				msg: `temporary erp portal password: ${password}`,
			},
			usedFor: "notification",
		};
		await emailContent(sendTo);
	});
	return {status: 200, data: newEmployees};
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

export const assignBankAccount = async (
	body: bankAccountType,
	employeeUuid: string,
	companyUuid: string,
) => {
	const company = await prisma.company.findUnique({
		where: {uuid: companyUuid},
		select: {
			Employee: {
				where: {uuid: employeeUuid, isActive: 1},
			},
		},
	});
	if (company?.Employee[0]) {
		const newPayrollForEmployee = await prisma.employee.update({
			where: {uuid: employeeUuid},
			data: {
				payType: "atm",
			},
			select: {id: true, payType: true},
		});
		const assignBank = await prisma.bankAccount.create({
			data: {
				uuid: await generateUuid(),
				...body,
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

export const orgChartTree = async (employeeUuid: string) => {
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
