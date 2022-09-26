const { table } = require("../db/connection");
const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((tableData) => tableData[0]);
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id: table_id }).first();
}

function seatTable(table) {
  return knex.transaction(function (trx) {
    return trx("tables")
    .where({ table_id: table.table_id })
    .update(table)
    .returning("*")
    .then(()=>{ //shorthand for updatedTable=>updatedTable[0]
      return trx("reservations")
      .where({ reservation_id: table.reservation_id})
      .update({status: `seated`})
      .returning("*")
      .then(updatedRes=>updatedRes[0])
    })
  })
}

function unSeatTable(table) {
  return knex.transaction(function(trx){
    return trx("tables")
    .where({ table_id: table.table_id })
    .update({reservation_id: null})
    .returning("*")
    .then(() => { //if you put in an argument here that will take the data you have currently updated
      return trx("reservations")
      .where({reservation_id: table.reservation_id})
      .update({status: `finished`})
      .returning("*")
      .then(tableData=>tableData[0])
    });
  })
}

module.exports = {
  list,
  create,
  read,
  unSeatTable,
  seatTable
};
