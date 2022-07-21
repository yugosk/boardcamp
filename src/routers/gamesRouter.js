import { Router } from "express";
import { getGames, postGame } from "../controllers/gamesControllers.js";
import { validateGame } from "../middlewares/gamesMiddleware.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateGame, postGame);

export default gamesRouter;
