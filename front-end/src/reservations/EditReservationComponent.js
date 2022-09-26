import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import FormComponent from "../formComponent/FormComponent";
import { updateRes, editRes } from "../utils/api";
import { formatAsDate } from "../utils/date-time";

export default function EditReservationsComponent() {
  const params = useParams();
  const history = useHistory();
  const [newReservation, setNewReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  }); //current
  const [errors, setErrors] = useState(null);
  const title = "Edit Reservation"

  useEffect(loadDashboard, [params.reservation_id]);

  function loadDashboard() {
    const abortController = new AbortController();
    setErrors(null);
    editRes(params.reservation_id, abortController.signal)
      .then(setNewReservation)
      .catch(setErrors);
    return () => abortController.abort();
  }

  const submitHandler = (event, newReservation) => {
    // console.log(event)
    event.preventDefault();
    newReservation.people = Number(newReservation.people);
    newReservation.reservation_date = formatAsDate(newReservation.reservation_date)
    // console.log('line52',params.reservation_id)
    updateRes(newReservation, params.reservation_id)
      .then(() =>
        history.push(`/dashboard/?date=${newReservation.reservation_date}`)
      )
      // .catch(setErrors);
      .catch(setErrors);
  };

  return (
    <FormComponent
      submitHandler={submitHandler}
      newReservation={newReservation}
      setNewReservation={setNewReservation}
      errors={errors}
      title={title}
    />
  );
}
