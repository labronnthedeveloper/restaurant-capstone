import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ListResComp from "./ListResComp";
import ListTablesComp from "./ListTablesComp";
import { today, next, previous } from "../utils/date-time";
import useQuery from "../utils/useQuery"; //**
import { useHistory } from "react-router-dom";

function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);
  const query = useQuery(); //**
  const date = query.get("date") || today(); //**

  const history = useHistory();

  useEffect(loadDashboard, [date]);
  function loadDashboard() {
    //needs to be renamed to loadReservations
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(loadTables, []);
  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null); //
    listTables(abortController.signal) //
      .then(setTables) //
      .catch(setTablesError); //
    return () => abortController.abort();
  }

  return (
    <main>
      <div className="d-md-flex flex-column flex-wrap my-4 py-4 text-center border dashboard-header">
          <h1 className="dash-h1"><b>DASHBOARD</b></h1>
          <h4 className="mb-0">Reservations for {date}</h4>
        <div className="d-flex flex-row justify-content-center mt-2">
          <button
            className="btn btn-secondary mx-1"
            onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
          >
            Previous
          </button>
          <button
            className="btn btn-secondary mx-1"
            onClick={() => history.push(`/dashboard?date=${today()}`)}
          >
            Today
          </button>
          <button
            className="btn btn-secondary mx-1"
            onClick={() => history.push(`/dashboard?date=${next(date)}`)}
          >
            Next
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col d-flex flex-wrap justify-content-around">
          {reservations.length !== 0 ? (
            <ListResComp
              reservations={reservations}
              loadDashboard={loadDashboard}
            />
          ) : (
            `There are no reservations today`
          )}
          <ErrorAlert error={reservationsError} />
        </div>

        <div className="col d-flex align-content-start flex-wrap justify-content-around">
          <ListTablesComp
            tables={tables}
            loadTables={loadTables}
            loadDashboard={loadDashboard}
          />
          <ErrorAlert error={tablesError} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
