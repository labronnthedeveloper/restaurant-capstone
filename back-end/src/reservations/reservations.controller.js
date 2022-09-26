/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const date = req.query.date;
  const mobile = req.query.mobile_number;
  //  console.log('mobile',mobile)
  if (date) {
    const data = await service.listDate(date);
    return res.json({
      data,
    });
  }
  if (mobile) {
    const data = await service.listMobile(mobile);
    return res.json({
      data,
    });
  } else {
    const data = await service.list();
    return res.json({ data });
  }
}

async function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_Id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `Reservation cannot be found : ${req.params.reservation_Id}`,
  });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const reservationId = req.params.reservation_Id;
  const resData = req.body.data;
  const updatedRes = {
    ...resData,
    reservation_id: reservationId,
  };
  const data = await service.update(updatedRes);
  // console.log('inUpdate',data)
  res.status(200).json({ data });
}

function isNumber(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const isNumber = data[propertyName].replace(/-/g, "");
    if (Number(isNumber)) {
      return next();
    }
    next({ status: 400, message: `${propertyName} needs to be a number` });
  };
}

function isPhoneNumber(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const isNumber = data[propertyName].replace(/-/g, "");
    if (Number(isNumber)) {
      return next();
    }
    next({ status: 400, message: `${propertyName} needs to be a number` });
  };
}



function isTime(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const isTime = data[propertyName].replace(/:/g, "");
    if (Number(isTime)) {
      //  if (Number(isTime) < 1030 || Number(isTime) > 930)
      return next();
    }
    return next({ status: 400, message: `${propertyName} needs to be a number` });
  };
}

function isPeopleNumber(req, res, next) {
  const { data = {} } = req.body;
  if (Number.isInteger(data.people)) {
    return next();
  }
  return next({ status: 400, message: `people is not a number` });
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `${propertyName}` });
  };
}

function isTuesday(req, res, next) {
  // console.log('hello',req)
  const { data = {} } = req.body; // gets the body of data from the JSON
  const day = new Date(data.reservation_date);
  const dayOf = day.getUTCDay(); // returns from 0-6 0 sunday ->
  if (dayOf === 2) {
    return next({ status: 400, message: `closed` });
  }
  next();
}

function isFutureRes(req, res, next) {
  const { data = {} } = req.body;
  const day = new Date(`${data.reservation_date} ${data.reservation_time} `);
  const today = new Date(); // empty argument = current
  // console.log('today',today, 'day', day)
  if (day < today) {
    return next({ status: 400, message: "Needs to be future date" });
  }
  return next();
}

function openHours(req, res, next) {
  const { data = {} } = req.body;
  const time = data.reservation_time;
  const currentTime = new Date();
  if (currentTime < time) {
    return next({
      status: 400,
      message: `please make reservation for a time after current time`,
    });
  }
  if (time < "10:30" || time > "20:30") {
    return next({
      status: 400,
      message: `Hours of operation are between 10:30AM to 09:30PM, latest reservations 1 hour before closing`,
    });
  }
  return next();
}

function resStatus(req, res, next) {
  const { data = {} } = req.body;
  const status = data.status;
  if (!status) {
    return next();
  }
  if (status !== "booked")
    return next({
      status: 400,
      message: status,
    });
  return next();
}

function isFinished(req, res, next) {
  // console.log('inIsFinished')
  let reservation = res.locals.reservation;
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: reservation.status,
    });
  }
  return next();
}

function validStatus(req, res, next) {
  // console.log('inValidStatus')
  let validStatuses = [`booked`, `seated`, `finished`, `cancelled`];
  const { data = {} } = req.body;
  const status = data.status;
  if (!validStatuses.includes(status)) {
    return next({
      status: 400,
      message: "unknown status",
    });
  }
  return next();
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    //  bodyDataHas("status"),
    isTuesday,
    isPeopleNumber,
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    isNumber("reservation_date"),
    isPhoneNumber("mobile_number"),
    isTime("reservation_time"),
    isFutureRes,
    openHours,
    resStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],

  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(bodyDataHas("first_name")),
    asyncErrorBoundary(bodyDataHas("last_name")),
    asyncErrorBoundary(bodyDataHas("mobile_number")),
    asyncErrorBoundary(bodyDataHas("reservation_date")),
    asyncErrorBoundary(bodyDataHas("reservation_time")),
    asyncErrorBoundary(bodyDataHas("people")),
    asyncErrorBoundary(isPeopleNumber),
    asyncErrorBoundary(isNumber("reservation_date")),
    asyncErrorBoundary(isTime("reservation_time")),
    asyncErrorBoundary(update),
  ],
  updateStatus: [reservationExists, isFinished, validStatus, asyncErrorBoundary(update)]
};
