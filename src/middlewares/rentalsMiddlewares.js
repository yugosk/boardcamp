import connection from "../dbStrategy/postgres.js";
import { rentalSchema } from "../schemas/rentalSchema.js";

export async function validateRentalFormat(req, res, next) {
  const newRental = req.body;

  const { error } = rentalSchema.validate(newRental, { abortEarly: false });
  if (error) {
    return res.status(400).send("formato");
  }

  res.locals.rental = newRental;
  next();
}

export async function validateRentalIds(req, res, next) {
  const newRental = res.locals.rental;

  const { rows: checkGameId } = await connection.query(
    `
    SELECT * FROM games WHERE id = $1
    `,
    [newRental.gameId]
  );

  const { rows: checkCustomerId } = await connection.query(
    `
    SELECT * FROM customers WHERE id = $1
    `,
    [newRental.customerId]
  );

  if (checkGameId.length === 0 || checkCustomerId.length === 0) {
    return res.status(400).send("gameId ou customerId");
  }

  next();
}

export async function checkAvailability(req, res, next) {
  const { gameId } = res.locals.rental;
  const { rows: rentals } = await connection.query(
    `
    SELECT "returnDate" from rentals WHERE "gameId" = $1 AND "returnDate" IS NULL
    `,
    [gameId]
  );
  const { rows: stock } = await connection.query(
    `
    SELECT "stockTotal" FROM games WHERE id = $1
    `,
    [gameId]
  );

  if (rentals.length >= stock[0].stockTotal) {
    return res.sendStatus(400);
  }

  next();
}

export async function validateReturnId(req, res, next) {
  const rentalId = req.params.id;
  const { rows: checkId } = await connection.query(
    `
  SELECT * FROM rentals WHERE id = $1
  `,
    [rentalId]
  );
  if (checkId.length === 0) {
    return res.sendStatus(404);
  }

  res.locals.id = rentalId;
  next();
}

export async function checkReturn(req, res, next) {
  const rentalId = res.locals.id;
  const { rows: checkReturn } = await connection.query(
    `
  SELECT * FROM rentals WHERE id = $1 AND "returnDate" IS NULL
  `,
    [rentalId]
  );

  if (checkReturn.length === 0) {
    return res.sendStatus(400);
  }

  next();
}
