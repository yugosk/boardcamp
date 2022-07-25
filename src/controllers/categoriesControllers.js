import connection from "../dbStrategy/postgres.js";

export async function getCategories(req, res) {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const { order, desc } = req.query;
  let additionalOperators = "";
  let orderOperators = "";

  if (offset && limit) {
    additionalOperators += `LIMIT ${limit} OFFSET ${offset}`;
  } else if (limit) {
    additionalOperators += `LIMIT ${limit}`;
  } else if (offset) {
    additionalOperators += `OFFSET ${offset}`;
  }

  if (order && desc) {
    orderOperators += `ORDER BY ${order} DESC`;
  } else if (order) {
    orderOperators += `ORDER BY ${order} ASC`;
  }

  try {
    const { rows: categories } = await connection.query(
      `SELECT * FROM categories
      ${orderOperators}
      ${additionalOperators}`
    );
    res.send(categories);
  } catch {
    res.sendStatus(500);
  }
}

export async function postCategory(req, res) {
  const newCategory = res.locals.category;
  try {
    await connection.query('INSERT INTO categories ("name") VALUES ($1)', [
      newCategory.name,
    ]);
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}
