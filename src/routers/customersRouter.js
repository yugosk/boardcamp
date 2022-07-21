import { Router } from "express";
import {
  getCustomers,
  getCustomerById,
  postCustomer,
} from "../controllers/customersControllers.js";
import {
  validateCustomerId,
  validateCustomer,
} from "../middlewares/customersMiddlewares.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", validateCustomerId, getCustomerById);
customersRouter.post("/customers", validateCustomer, postCustomer);

export default customersRouter;
