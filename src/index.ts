import express from "express";

const app = express();

const server = app.listen(3000, () =>
	console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
);
