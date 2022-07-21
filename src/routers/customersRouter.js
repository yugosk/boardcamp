import { Router } from "express";
import {
  getCustomers,
  getCustomerById,
  postCustomer,
  putCustomer,
} from "../controllers/customersControllers.js";
import {
  validateCustomerId,
  validateCustomer,
  validateUserUpdate,
} from "../middlewares/customersMiddlewares.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", validateCustomerId, getCustomerById);
customersRouter.post("/customers", validateCustomer, postCustomer);
customersRouter.put("/customers/:id", validateUserUpdate, putCustomer);

export default customersRouter;
