import { React } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import NewReservation from "../reservations/NewReservation";
import NewTable from "../table/NewTable";
import SeatComponent from "../dashboard/SeatComponent";
import SearchComponent from "../reservations/SearchComponent";
import EditReservationsComponent from "../reservations/EditReservationComponent";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/reservations/new">
        <NewReservation/>
      </Route>
      <Route path="/tables/new">
        <NewTable/>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatComponent/>
      </Route>
      <Route path="/search">
        <SearchComponent/>
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservationsComponent />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
