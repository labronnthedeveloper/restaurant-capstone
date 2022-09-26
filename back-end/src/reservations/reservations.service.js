const knex = require("../db/connection");

function list() {
  return knex("reservations")
    .select("*")
    .orderBy("reservations.reservation_time");
}

function listDate(date) {
  return knex("reservations")
    .select("*")
    .where({ "reservations.reservation_date": date })
    .whereNot({ "reservations.status": "finished" })
    .whereNot({ "reservations.status": "cancelled" })
    .orderBy("reservations.reservation_time");
}

function listMobile(mobile) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

function update(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation)
    .returning("*")
    .then((reservationData) => reservationData[0]);
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((reservationData) => reservationData[0]);
}

module.exports = {
  list,
  listDate,
  listMobile,
  update,
  create,
  read,
};
