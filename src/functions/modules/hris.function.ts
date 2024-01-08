import {parse} from "csv-parse";
import prisma from "../../../libs/prisma";
import {generateUuid} from "../../utils/uuid.util";
import {formatISO} from "date-fns";
import {onBoardType} from "../../../types/modules/hris/employess";
import {bankAccountType} from "../../../types/modules/hris/payroll";

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

// todo set body to correct type
export const createEmployee = async (body: any, companyUuid: string) => {
	const company = await prisma.company.findUnique({
		where: {uuid: companyUuid},
		select: {id: true},
	});
	if (company) {
		const newEmployee = await prisma.employee.create({
			data: {...body, uuid: await generateUuid(), Company: {connect: {id: company.id}}},
		});
		return {status: 200, data: newEmployee};
	} else {
		return {status: 404, data: "company not found"};
	}
};

export const onboardEmployee = async (body: onBoardType, employeeUuid: string) => {
	// ! bug this needs to be access within the company
	const {reportingToId, hiredDate, ...rest} = body;
	const newBoardedEmployee = await prisma.employee.update({
		where: {uuid: employeeUuid, isActive: 0},
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
		const updateEmployee = await prisma.employee.update({
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
						id: updateEmployee.id,
					},
				},
			},
		});
		return {status: 200, data: {updateEmployee, assignBank}};
	} else {
		return {status: 400, data: "invalid request"};
	}
};
