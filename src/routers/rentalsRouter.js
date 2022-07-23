import { Router } from "express";
import {
  getRentals,
  postRental,
  postReturn,
  deleteRental,
} from "../controllers/rentalsControllers.js";
import {
  validateRentalFormat,
  validateRentalIds,
  checkAvailability,
  validateReturnId,
  checkReturn,
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
rentalsRouter.post(
  "/rentals/:id/return",
  validateReturnId,
  checkReturn,
  postReturn
);
rentalsRouter.delete(
  "/rentals/:id",
  validateReturnId,
  checkReturn,
  deleteRental
);

export default rentalsRouter;
