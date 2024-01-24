import express from "express";
import path from "path";
import cors from "cors";
import prisma from "../libs/prisma";
import {employeeAuth, userAuth} from "./middlewares/authorization.middleware";
import publicRoute from "./routes/public.route";
import user from "./routes/user.route";
import config from "./routes/config.route";
import hris from "./routes/modules/hris.route";
import portal from "./routes/portal/employee.route";
import {CronJob} from "cron";
import {calculateTenure} from "./utils/tenure.util";

const port = process.env.EXPRESS_PORT;
const app = express();
app.use(express.json());
app.use(cors());

const job = new CronJob(
	"0 0 0 * * *", // run every day at 12:00 AM
	async () => {
		try {
			const employees = await prisma.employee.findMany({select: {uuid: true, hiredDate: true}});
			if (employees.length !== 0) {
				for (const employee of employees) {
					await prisma.employee.update({
						where: {uuid: employee.uuid},
						data: {tenure: JSON.stringify(calculateTenure(employee.hiredDate))},
					});
				}
			}
		} catch (error: any) {
			console.error(error);
		}
	},
	null, // onComplete
	false, // start
	"Asia/Manila", // timeZone
);
job.start();

app.get("/", (req, res) => {
	res.json({data: "welcome"});
});
app.use("/public/avatar", express.static(path.join("public/avatar/")));
app.use("/public/api", publicRoute);
app.use("/api/user", userAuth, user);
app.use("/api/config", userAuth, config);
app.use("/api/module/hris", userAuth, hris);
app.use("/api/portal", employeeAuth, portal);

const server = () => {
	const host = `http://localhost:${port}`;
	console.log(`Server ready at: ${host}`);
};
const database = async () => {
	try {
		await prisma.$queryRaw`SELECT 1 as result`;
		console.log("Database connection is established!");
	} catch (error: any) {
		console.log("Error connecting to the database: ", error);
	}
};

app.listen(port, async () => {
	server();
	await database();
});
