import { Router } from "express";
import {
  getCategories,
  postCategory,
} from "../controllers/categoriesControllers.js";
import { validateCategory } from "../middlewares/categoriesMiddleware.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", validateCategory, postCategory);

export default categoriesRouter;
