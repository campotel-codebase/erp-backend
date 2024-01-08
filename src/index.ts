import express from "express";
import path from "path";
import cors from "cors";
import prisma from "../libs/prisma";
import {authorization} from "./middlewares/auth.middleware";
import publicRoute from "./routes/public.route";
import user from "./routes/user.route";
import config from "./routes/config.route";

const port = process.env.EXPRESS_PORT;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.json({data: "welcome"});
});
app.use("/public/avatar", express.static(path.join("public/avatar/")));
app.use("/public/api", publicRoute);
app.use("/api/user", authorization, user);
app.use("/api/config", authorization, config);

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
