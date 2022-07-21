import { Router } from "express";
import { getGames } from "../controllers/gamesControllers.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
//gamesRouter.post("/games", validateGame, postGame);

export default gamesRouter;
