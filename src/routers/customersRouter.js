import { Router } from "express";
import {
  getCustomers,
  getCustomerById,
} from "../controllers/customersControllers.js";
import { validateCustomerId } from "../middlewares/customersMiddlewares.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", validateCustomerId, getCustomerById);

export default customersRouter;
