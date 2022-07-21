import connection from "../dbStrategy/postgres.js";

export async function getCategories(req, res) {
  try {
    const { rows: categories } = await connection.query(
      "SELECT * FROM categories"
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
