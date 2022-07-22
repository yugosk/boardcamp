import connection from "../dbStrategy/postgres.js";

export async function getGames(req, res) {
  const filter = req.query.name;
  if (!filter) {
    try {
      const { rows: gameList } = await connection.query(
        `SELECT games.*, categories.name AS "categoryName" FROM games
        JOIN categories
        ON games."categoryId" = categories.id`
      );
      res.send(gameList);
    } catch {
      res.sendStatus(500);
    }
  } else {
    try {
      const { rows: gameList } = await connection.query(
        `SELECT games.*, categories.name AS "categoryName" FROM games
        JOIN categories
        ON games."categoryId" = categories.id
        WHERE LOWER(games.name) LIKE LOWER($1)`,
        [`${filter}%`]
      );
      res.send(gameList);
    } catch {
      res.sendStatus(500);
    }
  }
}

export async function postGame(req, res) {
  const newGame = res.locals.game;
  try {
    await connection.query(
      `
        INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay")
        VALUES ($1, $2, $3, $4, $5)`,
      [
        newGame.name,
        newGame.image,
        newGame.stockTotal,
        newGame.categoryId,
        newGame.pricePerDay,
      ]
    );
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}
