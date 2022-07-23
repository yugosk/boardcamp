import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import categoriesRouter from "./routers/categoriesRouter.js";
import gamesRouter from "./routers/gamesRouter.js";
import customersRouter from "./routers/customersRouter.js";
import rentalsRouter from "./routers/rentalsRouter.js";

const server = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

server.use(cors());
server.use(express.json());

server.use(categoriesRouter);
server.use(gamesRouter);
server.use(customersRouter);
server.use(rentalsRouter);

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
