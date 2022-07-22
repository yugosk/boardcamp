import { Router } from "express";
import { getRentals, postRental } from "../controllers/rentalsControllers.js";
import {
  validateRentalFormat,
  validateRentalIds,
  checkAvailability,
} from "../middlewares/rentalsMiddlewares.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post(
  "/rentals",
  validateRentalFormat,
  validateRentalIds,
  checkAvailability,
  postRental
);

export default rentalsRouter;
