import { useState } from "react";
import { useHistory } from "react-router-dom";
import FormComponent from "../formComponent/FormComponent";
import { createRes } from "../utils/api";
export default function NewReservation() {

  const history = useHistory();
  const [errors, setErrors] = useState(null);

  const [newReservation,setNewReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  })
  
  const title = "Make New Reservation"

  const submitHandler = (event, newReservation) => {
    // console.log('newResComp',newReservation)
    event.preventDefault();
    newReservation.people = Number(newReservation.people);
    createRes(newReservation)
      .then(() => {
        history.push(`/dashboard?date=${newReservation.reservation_date}`);
      })
      .catch(setErrors);
  };

  return (
    <FormComponent
    submitHandler={submitHandler}
    errors={errors}
    setNewReservation={setNewReservation}
    newReservation={newReservation}
    title={title}
    />
  )
}
