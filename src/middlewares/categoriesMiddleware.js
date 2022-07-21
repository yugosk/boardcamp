import { categorySchema } from "../schemas/categorySchema.js";
import connection from "../dbStrategy/postgres.js";

export async function validateCategory(req, res, next) {
  const newCategory = req.body;
  const { error } = categorySchema.validate(newCategory);
  if (error) {
    return res.sendStatus(400);
  }

  const { rows: categoryCheck } = await connection.query(
    `
  SELECT * FROM categories WHERE name = $1
  `,
    [newCategory.name]
  );
  if (categoryCheck.length !== 0) {
    return res.sendStatus(409);
  }

  res.locals.category = newCategory;

  next();
}
