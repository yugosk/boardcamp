import connection from "../dbStrategy/postgres.js";
import dayjs from "dayjs";

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

export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = res.locals.rental;
  const { rows: price } = await connection.query(
    `
  SELECT "pricePerDay" FROM games WHERE id = $1
  `,
    [gameId]
  );

  try {
    await connection.query(
      `
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, null, $5, null)
      `,
      [
        customerId,
        gameId,
        dayjs().format("YYYY-MM-DD"),
        daysRented,
        price[0].pricePerDay * daysRented,
      ]
    );
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
}
