import express from "express";
import cors from "cors";
import categoriesRouter from "./routers/categoriesRouter.js";
import gamesRouter from "./routers/gamesRouter.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use(categoriesRouter);
server.use(gamesRouter);

server.listen(4000, () => console.log("Servidor rodando na porta 4000."));
