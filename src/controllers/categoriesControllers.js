import connection from "../dbStrategy/postgres.js";

export async function getCategories(req, res) {
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);

  if (offset && limit) {
    try {
      const { rows: categories } = await connection.query(
        `SELECT * FROM categories LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      res.send(categories);
    } catch {
      res.sendStatus(500);
    }
  } else if (offset) {
    try {
      const { rows: categories } = await connection.query(
        `SELECT * FROM categories OFFSET $1`,
        [offset]
      );
      res.send(categories);
    } catch {
      res.sendStatus(500);
    }
  } else if (limit) {
    try {
      const { rows: categories } = await connection.query(
        `SELECT * FROM categories LIMIT $1`,
        [limit]
      );
      res.send(categories);
    } catch {
      res.sendStatus(500);
    }
  } else {
    try {
      const { rows: categories } = await connection.query(
        "SELECT * FROM categories"
      );
      res.send(categories);
    } catch {
      res.sendStatus(500);
    }
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
