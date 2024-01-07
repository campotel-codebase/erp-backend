import express from "express";
import cors from "cors";
import prisma from "../libs/prisma";
import publicRoute from "./routes/public.route";

const port = process.env.EXPRESS_PORT;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.json({data: "welcome"});
});
app.use("/public/api", publicRoute);

const listeningTo = () => {
	console.log("🚀 Server ready at: http://localhost:" + port);
	prisma.$queryRaw`SELECT 1 as result`
		.then(() => {
			console.log("⭐️ Connected to SQL Server.");
		})
		.catch((error) => {
			console.log("Error connecting to SQL Server:", error);
		});
};

app.listen(port, listeningTo);
