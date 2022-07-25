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
  const offset = Number(req.query.offset);
  const limit = Number(req.query.limit);
  const { status, startDate, order } = req.query;
  let additionalOperators = "";
  let orderOperators = "";
  let statusFilters = "";

  if (status === "open") {
    statusFilters += `AND rentals."returnDate" IS NOT NULL`;
  } else if (status === "closed") {
    statusFilters += `AND rentals."returnDate" IS NULL`;
  }

  if (offset && limit) {
    additionalOperators += `LIMIT ${limit} OFFSET ${offset}`;
  } else if (limit) {
    additionalOperators += `LIMIT ${limit}`;
  } else if (offset) {
    additionalOperators += `OFFSET ${offset}`;
  }

  if (order && desc) {
    orderOperators += `ORDER BY ${order} DESC`;
  } else if (order) {
    orderOperators += `ORDER BY ${order} ASC`;
  }

  if (customerQuery) {
    try {
      const { rows: rentalList } = await connection.query(
        `
          SELECT rentals.*, customers.name AS "customerName", games.name, games."categoryId", categories.name AS "categoryName" FROM rentals
          JOIN customers ON rentals."customerId" = customers.id
          JOIN games ON rentals."gameId" = games.id
          JOIN categories ON categories.id = (SELECT "categoryId" FROM games WHERE id = rentals."gameId")
          WHERE rentals."customerId" = $1
          ${statusFilters}
          ${orderOperators}
          ${additionalOperators}
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
          ${statusFilters}
          ${orderOperators}
          ${additionalOperators}
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
          ${statusFilters}
          ${orderOperators}
          ${additionalOperators}
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

export async function postReturn(req, res) {
  const rentalId = res.locals.id;
  const today = dayjs().format("YYYY-MM-DD");
  const { rows: rentalInfo } = await connection.query(
    `
  SELECT "daysRented", "rentDate", "originalPrice" FROM rentals WHERE id = $1
  `,
    [rentalId]
  );

  const difference = dayjs(today).diff(rentalInfo[0].rentDate, "day");

  if (difference > rentalInfo[0].daysRented) {
    await connection.query(
      `
    UPDATE rentals SET "returnDate"='${today}', "delayFee"=${
        difference * (rentalInfo[0].originalPrice / rentalInfo[0].daysRented)
      } WHERE id = $1
    `,
      [rentalId]
    );
  } else {
    await connection.query(
      `
    UPDATE rentals SET "returnDate"='${today}' WHERE id = $1
    `,
      [rentalId]
    );
  }

  res.sendStatus(200);
}

export async function deleteRental(req, res) {
  const rentalId = res.locals.id;
  try {
    await connection.query(
      `
      DELETE FROM rentals WHERE id = $1
      `,
      [rentalId]
    );

    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
}

function addAverage(obj) {
  return {
    revenue: obj.revenue,
    rentals: obj.rentals,
    average: Math.floor(obj.revenue / obj.rentals),
  };
}

export async function getMetrics(req, res) {
  try {
    const { rows: metrics } = await connection.query(`
    SELECT SUM("originalPrice" + "delayFee") AS revenue, COUNT(id) AS "rentals" FROM rentals
    `);
    res.send(addAverage(metrics[0]));
  } catch {
    res.sendStatus(500);
  }
}
