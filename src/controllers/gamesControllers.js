import connection from "../dbStrategy/postgres.js";

export async function getGames(req, res) {
  const filter = req.query.name;
  if (!filter) {
    try {
      const { rows: gameList } = await connection.query(`SELECT * FROM games`);
      //missing JOIN to add categoryName property
      res.send(gameList);
    } catch {
      res.sendStatus(500);
    }
  } else {
    try {
      const { rows: gameList } = await connection.query(
        `SELECT * FROM games WHERE LOWER(name) LIKE LOWER($1)`,
        [`${filter}%`]
      );
      //missing JOIN to add categoryName property
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
