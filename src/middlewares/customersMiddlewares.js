import { customerSchema } from "../schemas/customerSchema.js";
import connection from "../dbStrategy/postgres.js";

export async function validateCustomerId(req, res, next) {
  const customerId = req.params.id;
  const { rows: checkId } = await connection.query(
    `
    SELECT * FROM customers WHERE id = $1
    `,
    [customerId]
  );
  if (checkId.length === 0) {
    return res.sendStatus(404);
  }

  res.locals.customerId = checkId;
  next();
}

export async function validateCustomer(req, res, next) {
  const newCustomer = req.body;
  const { error } = customerSchema.validate(newCustomer);
  if (error) {
    console.log(error);
    return res.sendStatus(400);
  }

  const { rows: customerCheck } = await connection.query(
    `
    SELECT * FROM customers WHERE cpf = $1
    `,
    [newCustomer.cpf]
  );
  if (customerCheck.length !== 0) {
    return res.sendStatus(409);
  }

  res.locals.customer = newCustomer;
  next();
}
