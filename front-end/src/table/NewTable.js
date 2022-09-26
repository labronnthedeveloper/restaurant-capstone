import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewTable() {
  const history = useHistory();
  const [tables, setTables] = useState([]);
  const [errors, setErrors] = useState(null);

  //v--This use state is for the handle change--v//
  const [newTable, setNewTable] = useState({
    table_name: "",
    capacity: "",
  });
  const handleChange = (event) => {
    //handles the input in the form html
    const { target } = event;
    const value = target.value;
    setNewTable({ ...newTable, [target.name]: value });
    // console.log("value",newTable, [target.name], value);
  };
  //^--One segment of code--^//

  const submitHandler = (event) => {
    event.preventDefault();
    newTable.capacity = Number(newTable.capacity);
    createTable(newTable) //a function in my utils folder
      //create call back to receive new table for id from create table
      .then((updatedTable) => {
        setTables([...tables, updatedTable]);
      })
      .then(() => history.push("/"))
      .catch(setErrors);
  };

  return (
    <div className="form-page">
      <form onSubmit={submitHandler}>
        <div>
          <h1>Create New Table</h1>
          <input
            type="text"
            name="table_name"
            value={newTable.table_name}
            placeholder="table name"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="number"
            name="capacity"
            value={newTable.capacity}
            placeholder="capacity"
            onChange={handleChange}
          />
        </div>
        <ErrorAlert error={errors} />
        <button className="btn btn-secondary m-1" type="submit">Submit</button>
        <button className="btn btn-secondary m-1"
          onClick={() => {
            history.go("-1");
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
