import connection from "../dbStrategy/postgres.js";

export async function getGames(req, res) {
  try {
    const { rows: gameList } = await connection.query(`SELECT * FROM games`);
    //missing JOIN to add categoryName property
    res.send(gameList);
  } catch {
    res.sendStatus(500);
  }
}
