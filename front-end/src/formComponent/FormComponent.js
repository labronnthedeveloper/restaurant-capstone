import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router";
// import { useEffect, useState } from "react";
// import { formatAsDate } from "../utils/date-time";

export default function FormComponent({
  newReservation,
  submitHandler,
  setNewReservation,
  errors,
  title,
}) {
  const history = useHistory();
  // const [formData, setFormData] = useState(newReservation);

  // useEffect(() => {
  //   setFormData({
  //     ...newReservation,
  //     reservation_date: newReservation.reservation_date
  //       ? formatAsDate(newReservation.reservation_date)
  //       : "",
  //   });
  // }, [newReservation]);
  //()=>setFormData is invoking the full function in use effect, while just setFormData would just be giving the value of setFormData and no function

  const handleChange = (event) => {
    const { target } = event;
    const value = target.value;
    setNewReservation({ ...newReservation, [target.name]: value });
  };
  return (
    <div className="form-page">
      <h1>{title}</h1>
      <form onSubmit={(e) => submitHandler(e, newReservation)}>
        <div>
          <input
            name="first_name"
            value={newReservation.first_name}
            placeholder={"First Name"}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="last_name"
            value={newReservation.last_name}
            placeholder={"Last Name"}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="string"
            name="mobile_number"
            value={newReservation.mobile_number}
            placeholder={"Mobile Number"}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="people"
            min="1"
            max="20"
            value={newReservation.people}
            placeholder="Party Size"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            name="reservation_date"
            type="date"
            value={newReservation.reservation_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="time"
            name="reservation_time"
            value={newReservation.reservation_time}
            onChange={handleChange}
          />
        </div>
        <ErrorAlert error={errors} />
        <button className="btn btn-secondary m-2" type="submit">Submit</button>
        <button className="btn btn-secondary m-2"
          data-reservation-id-cancel={newReservation.reservation_id}
          type="button"
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
