import connection from "../dbStrategy/postgres.js";

export async function getCustomers(req, res) {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const filter = req.query.cpf;

  if (!filter) {
    if (offset && limit) {
      try {
        const { rows: customerList } = await connection.query(
          `SELECT * FROM customers LIMIT $1 OFFSET $2`,
          [limit, offset]
        );
        res.send(customerList);
      } catch {
        res.sendStatus(500);
      }
    } else if (limit) {
      try {
        const { rows: customerList } = await connection.query(
          `SELECT * FROM customers LIMIT $1`,
          [limit]
        );
        res.send(customerList);
      } catch {
        res.sendStatus(500);
      }
    } else if (offset) {
      try {
        const { rows: customerList } = await connection.query(
          `SELECT * FROM customers OFFSET $1`,
          [offset]
        );
        res.send(customerList);
      } catch {
        res.sendStatus(500);
      }
    } else {
      try {
        const { rows: customerList } = await connection.query(
          `SELECT * FROM customers`
        );
        res.send(customerList);
      } catch {
        res.sendStatus(500);
      }
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

export async function postCustomer(req, res) {
  const newCustomer = res.locals.customer;
  try {
    await connection.query(
      `
    INSERT INTO customers ("name", "phone", "cpf", "birthday")
    VALUES ($1, $2, $3, $4)
    `,
      [
        newCustomer.name,
        newCustomer.phone,
        newCustomer.cpf,
        newCustomer.birthday,
      ]
    );
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}

export async function putCustomer(req, res) {
  const customerData = res.locals.customer;
  const customerId = res.locals.customerId;

  try {
    await connection.query(
      `
    UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5
    `,
      [
        customerData.name,
        customerData.phone,
        customerData.cpf,
        customerData.birthday,
        customerId,
      ]
    );
    res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
}
