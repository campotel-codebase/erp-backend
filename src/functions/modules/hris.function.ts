import {parse} from "csv-parse";

export const employeesCsvToJsonArray = async (params: {
	expectedHeader: string[];
	csvBuffer: string;
}) => {
	const {expectedHeader, csvBuffer} = params;
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
