import connection from "../dbStrategy/postgres.js";

export async function getCategories(req, res) {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  let additionalOperators = "";

  if (offset && limit) {
    additionalOperators += `LIMIT ${limit} OFFSET ${offset}`;
  } else if (limit) {
    additionalOperators += `LIMIT ${limit}`;
  } else if (offset) {
    additionalOperators += `OFFSET ${offset}`;
  }

  try {
    const { rows: categories } = await connection.query(
      `SELECT * FROM categories
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
