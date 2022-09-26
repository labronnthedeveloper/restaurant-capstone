import { updateResStatus } from "../utils/api"

export default function ListResComp({ reservations, loadDashboard }) {


  function onCancel(e,reservation){
    e.preventDefault()
    if(window.confirm("Do you want to cancel this reservation?")){
      updateResStatus(reservation.reservation_id)
      .then(()=>loadDashboard())
    }
  }

  let list = reservations.map((reservation) => {
  

    let {reservation_id, last_name, first_name, people, mobile_number, status, reservation_time, reservation_date} = reservation
    return (
      <div key={reservation.reservation_id} className="col-sm col-xl-5 border pt-2 reservations-tables mb-4">
        <p>
          <b>Reservation Date</b> : {reservation_date}
        </p>
        <p>
          <b>Guest Name</b> : {first_name} {last_name}
        </p>
        <p>
          <b>Party Size</b> : {people}
        </p>
        <p>
          <b>Contact</b> : {mobile_number}
        </p>
        <p>
          <b>Reservation Time</b> : {reservation_time}
        </p>
        <p>
          <b>Reservation ID</b>: {reservation_id}
        </p>
        <p data-reservation-id-status={reservation_id}>
          <b>Reservation Status</b>: {status}
        </p>
        <div className="my-3 d-flex flex-wrap justify-content-evenly">
        { status!=='seated' ? 
        <a href={`/reservations/${reservation_id}/seat`}>
          <button className="mr-2 btn btn-primary"
          >Seat</button></a> 
          
          : null }


        <a href={`/reservations/${reservation_id}/edit`}>
        <button className="mr-2 btn btn-secondary" 
        >Edit</button>
        </a>

        <button className="mr-2 btn btn-danger" data-reservation-id-cancel={reservation.reservation_id} onClick={(e)=>onCancel(e,reservation)}>Cancel</button>
        </div>
      </div>
    );
  });

  return (
    <>
        {list}
    </>
  );
}
