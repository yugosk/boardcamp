import { customerSchema } from "../schemas/customerSchema.js";
import connection from "../dbStrategy/postgres.js";

export async function validateCustomerId(req, res, next) {
  const customerId = Number(req.params.id);
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

export async function validateUserUpdate(req, res, next) {
  const customerId = Number(req.params.id);
  const newCustomerData = req.body;
  const { rows: checkId } = await connection.query(
    `
    SELECT * FROM customers WHERE id = $1
  `,
    [customerId]
  );

  if (checkId.length === 0) {
    return res.sendStatus(404);
  }

  const { error } = customerSchema.validate(newCustomerData);
  if (error) {
    return res.sendStatus(400);
  }

  const { rows: cpfCheck } = await connection.query(
    `
    SELECT * FROM customers WHERE cpf = $1
  `,
    [newCustomerData.cpf]
  );

  if (cpfCheck.length !== 0 && cpfCheck[0].id !== customerId) {
    return res.sendStatus(409);
  }

  res.locals.customerId = customerId;
  res.locals.customer = newCustomerData;
  next();
}
