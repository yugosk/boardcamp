import connection from "../dbStrategy/postgres.js";

export async function getCustomers(req, res) {
  const filter = req.query.cpf;
  if (!filter) {
    try {
      const { rows: customerList } = await connection.query(
        `SELECT * FROM customers`
      );
      res.send(customerList);
    } catch {
      res.sendStatus(500);
    }
  } else {
    try {
      const { rows: customerList } = await connection.query(
        `SELECT * FROM customers WHERE cpf LIKE $1`,
        [`${filter}%`]
      );
      res.send(customerList);
    } catch {
      res.sendStatus(500);
    }
  }
}

export async function getCustomerById(req, res) {
  const customerId = res.locals.customerId;
  res.send(customerId[0]);
}
