import { updateResId } from "../utils/api";

export default function ListTablesComp({ tables, loadTables, loadDashboard }) {
  
  function clickHandler(event) {
    let tableId = event.target.value;
    tableId = Number(tableId);
    // console.log(event.target.value)
    if (window.confirm("Is this table ready to seat new guests?") === true) {
      updateResId(tableId)
        .then(() => loadTables())
        .then(() => loadDashboard())
        .catch((error) => console.log("error", error));
    }
  }

  const list = tables.map((table) => {

    const finish = <div className="finish">
    <span><b>Reservation Id: </b>{table.reservation_id}</span> <button className="btn btn-danger finish-button"
    value={table.table_id}
    data-table-id-finish={table.table_id}
    onClick={clickHandler}
    >
    Finish
  </button>
    </div>

    return (
      <div key={table.table_id} className="col col-xl-5 border pt-2 reservations-tables mb-4">
        <p>
          <b>Table Name: </b>
          {table.table_name}
        </p>
        <p>
          <b>Table ID: </b>
          {table.table_id}
        </p>
        <p>
          <b>Table Capacity: </b>
          {table.capacity}
        </p>
        
        <p>
          <b>Table Status: </b>
          <span data-table-id-status={table.table_id}>
            {table.reservation_id ? `Occupied` : `Free`}
          </span>
        </p>

        {table.reservation_id ? finish
         : null}
      </div>
    );
  });
  return <>{list}</>;
}
