import { gameSchema } from "../schemas/gameSchema.js";
import connection from "../dbStrategy/postgres.js";

export async function validateGame(req, res, next) {
  const newGame = req.body;
  const { error } = gameSchema.validate(newGame, { abortEarly: false });
  if (error) {
    return res.sendStatus(400);
  }

  const { rows: gameCheck } = await connection.query(
    `
    SELECT * FROM games WHERE name = $1
    `,
    [newGame.name]
  );
  if (gameCheck.length !== 0) {
    return res.sendStatus(409);
  }

  res.locals.game = newGame;
  next();
}
