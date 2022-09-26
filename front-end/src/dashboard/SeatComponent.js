import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, updateTable } from "../utils/api";

export default function SeatComponent() {
  const history = useHistory();
  const [tableId, setTableId] = useState();
  const [tablesError, setTablesError] = useState(null);
  const [tables, setTables] = useState([]);

  
  let params = useParams();
  let reservation_id = params.reservation_id;
  
  useEffect(loadTables, []);
  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const handleChange = (event) => {
    const { target } = event;
    const value = target.value;
    // console.log("value", [target.name], value);
    // setTableStatus({ ...tableStatus, table_id: value });
    setTableId(value);
    console.log("value", [target.name], value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if(tableId && tableId !== "none"){
      // reservation_id = Number(reservation_id);
      updateTable(tableId, reservation_id)
      .then(()=>history.push("/dashboard"))
      .catch(setTablesError);
    }
  };

  const tablesForm = tables.map((table) => {
    // console.log("hello", table.reservation_id);
    return (

        <option key={table.table_id} value={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>

    );
  });

  return (
    <form onSubmit={submitHandler}>
      <select required name="table_id" onChange={handleChange}>
        <option>none</option>
        {tablesForm}
      </select>
      <button type="submit">Submit</button>
      <button type="button" onClick={() => history.go(-1)}>
        Cancel
      </button>
      <ErrorAlert error={tablesError} />
    </form>
  );
}
