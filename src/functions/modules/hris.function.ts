import {parse} from "csv-parse";
import prisma from "../../../libs/prisma";
import {generateUuid} from "../../utils/uuid.util";

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
