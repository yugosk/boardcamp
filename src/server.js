import express from "express";
import cors from "cors";
import connection from "./dbStrategy/postgres.js";
import categoriesRouter from "./routers/categoriesRouter.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use(categoriesRouter);

server.listen(4000, () => console.log("Servidor rodando na porta 4000."));
