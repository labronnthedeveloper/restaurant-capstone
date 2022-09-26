import { useState } from "react";
import {  listReservations } from "../utils/api";
import ListResComp from "../dashboard/ListResComp";

export default function SearchComponent(){
  // const history = useHistory()
  const [formData, setFormData] = useState({})
  const [reservations, setReservations] = useState([])
  const [searched, setSearched] = useState(false)


  // console.log('phone',phoneNumber)

  const handleChange = (event) => {
    const { target } = event;
    const value = target.value;
    // console.log('value',[target.name],value)
    setFormData({ ...formData, [target.name]: value });
    // console.log("value", [target.name], value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setSearched(true)
    const abortController = new AbortController();
    listReservations( formData, abortController.signal )
    .then((response)=>setReservations(response))
    .catch((error)=>console.log(error));
    return () => abortController.abort()
  };

  return (
    <div className="form-page">
      <div className="dashboard-header my-4 py-4">
      <h1>Search for customer</h1>
      </div>
    <form className="reservations-tables py-2 mb-4"
    onSubmit={submitHandler}
    >
      <label><b>Mobile Number</b> :</label> <input onChange={handleChange} type="search" name="mobile_number" placeholder="Enter a customer's phone number" required></input> 
      <button className="btn btn-secondary mb-1 ml-1" type="submit">Find</button>
    </form>
    <div>
    {reservations.length !== 0 ? <ListResComp reservations={reservations}/> : null}  
    {searched === true && reservations.length === 0 ? `No reservations found with this phone number` : null}
    </div>
    </div>
  )
}