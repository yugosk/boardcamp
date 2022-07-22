import connection from "../dbStrategy/postgres.js";

function mapResponse(obj) {
  return {
    id: obj.id,
    customerId: obj.customerId,
    gameId: obj.gameId,
    rentDate: obj.rentDate,
    daysRented: obj.daysRented,
    returnDate: obj.returnDate,
    originalPrice: obj.originalPrice,
    delayFee: obj.delayFee,
    customer: {
      id: obj.customerId,
      name: obj.customerName,
    },
    game: {
      id: obj.gameId,
      name: obj.name,
      categoryId: obj.categoryId,
      categoryName: obj.categoryName,
    },
  };
}

export async function getRentals(req, res) {
  const customerQuery = req.query.customerId;
  const gameQuery = req.query.gameId;

  if (customerQuery) {
    try {
      const { rows: rentalList } = await connection.query(
        `
          SELECT rentals.*, customers.name AS "customerName", games.name, games."categoryId", categories.name AS "categoryName" FROM rentals
          JOIN customers ON rentals."customerId" = customers.id
          JOIN games ON rentals."gameId" = games.id
          JOIN categories ON categories.id = (SELECT "categoryId" FROM games WHERE id = rentals."gameId")
          WHERE rentals."customerId" = $1
          `,
        [customerQuery]
      );
      res.send(rentalList.map(mapResponse));
    } catch {
      res.sendStatus(500);
    }
  } else if (gameQuery) {
    try {
      const { rows: rentalList } = await connection.query(
        `
          SELECT rentals.*, customers.name AS "customerName", games.name, games."categoryId", categories.name AS "categoryName" FROM rentals
          JOIN customers ON rentals."customerId" = customers.id
          JOIN games ON rentals."gameId" = games.id
          JOIN categories ON categories.id = (SELECT "categoryId" FROM games WHERE id = rentals."gameId")
          WHERE rentals."gameId" = $1
          `,
        [gameQuery]
      );
      res.send(rentalList.map(mapResponse));
    } catch {
      res.sendStatus(500);
    }
  } else {
    try {
      const { rows: rentalList } = await connection.query(`
          SELECT rentals.*, customers.name AS "customerName", games.name, games."categoryId", categories.name AS "categoryName" FROM rentals
          JOIN customers ON rentals."customerId" = customers.id
          JOIN games ON rentals."gameId" = games.id
          JOIN categories ON categories.id = (SELECT "categoryId" FROM games WHERE id = rentals."gameId")
          `);
      res.send(rentalList.map(mapResponse));
    } catch {
      res.sendStatus(500);
    }
  }
}
