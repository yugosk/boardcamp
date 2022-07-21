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
