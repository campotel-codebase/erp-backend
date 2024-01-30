import {Prisma} from "@prisma/client";
import {parse} from "csv-parse";
import {userAuthCredentialsType} from "../../../../types/jwt-payload";
import {generatePassword, hashPassword} from "../../../utils/password.util";
import prisma from "../../../../libs/prisma";
import {generateUuid} from "../../../utils/uuid.util";
import {emailContent} from "../../../utils/email.util";

export const importEmployees = async (
	company: userAuthCredentialsType["company"],
	csvBuffer: string,
) => {
	const benefitsToArray: string[] = JSON.parse(company.benefits ? company.benefits : "[]");
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

export const makeEmployees = async (
	company: userAuthCredentialsType["company"],
	body: Prisma.EmployeeCreateManyInput[],
) => {
	// reporting to needs to be imported here
	const employees = await Promise.all(
		body.map(async (employee: Prisma.EmployeeCreateManyInput) => {
			const fullName = `${employee.lastName} ${employee.firstName} ${employee.middleName}`;
			return {
				...employee,
				companyId: company.id,
				fullName,
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
	for (const employee of employees) {
		const sendTo = {
			to: employee.email,
			subject: "newly hired",
			text: {
				title: `Welcome ${employee.fullName} to ${company.name}`,
				msg: `Temporary ERP portal password: ${employee.password}`,
			},
			usedFor: "notification",
		};
		await emailContent(sendTo);
	}
	return {status: 200, data: newEmployees};
};

export const makeEmployee = async (
	company: userAuthCredentialsType["company"],
	body: {employee: Prisma.EmployeeCreateInput; reportingToId: number},
) => {
	const fullName = `${body.employee.lastName} ${body.employee.firstName} ${body.employee.middleName}`;
	const tempPassword = generatePassword;
	const newEmployee = await prisma.employee.create({
		data: {
			...body.employee,
			fullName,
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
