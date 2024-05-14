import { BrowserRouter as Router, Route, Link, Switch, NavLink, } from "react-router-dom";
import Page404 from "../components/ErrorPage/Page404";
import Users from "../components/ManageUsers/Users";
import PrivateRoutes from "./PrivateRoutes";
import LoginUser from '../components/UserLogin/Login';
import ListUser from "../components/User/ListUser";
import ListProposeSent from "../components/Propose/ListProposeSent";
import ListProposeReceiveIn from "../components/Propose/ListProposeReceiveIn";
import ListProposeReceiveOut from "../components/Propose/ListProposeReceiveOut";
import ListDoc from "../components/User/ListDoc";
import ListDocOfDepartment from "../components/User/ListDocOfDepartment";
import TaskOutDepartment from "../components/Task/TaskOutDepartment";
import TaskInDepartment from "../components/Task/TaskInDepartment";
import MyWorkCalendar from "../components/Work/MyWorkCalendar";
import Header from "../components/Nav/Header";

const AppRoutes = (props) => {
  return (
    <>
      <Router>
        <Header />
        <Switch>
          <Route exact path="/">{"home"}</Route>
          <Route path="/about">about</Route>
          <Route path="/login-user"><LoginUser /></Route>
          <PrivateRoutes path="/users" component={Users} />
          <PrivateRoutes path="/list-user" component={ListUser} />
          <PrivateRoutes path="/list-propose-sent" component={ListProposeSent} />
          <PrivateRoutes path="/list-propose-recive-in-department" component={ListProposeReceiveIn} />
          <PrivateRoutes path="/list-propose-recive-out-department" component={ListProposeReceiveOut} />
          <PrivateRoutes path="/list-doc" component={ListDoc} />
          <PrivateRoutes path="/list-doc-department" component={ListDocOfDepartment} />
          <PrivateRoutes path="/task-out-department" component={TaskOutDepartment} />
          <PrivateRoutes path="/task-in-department" component={TaskInDepartment} />
          <PrivateRoutes path="/my-to-do-list-schedule" component={MyWorkCalendar} />
          <Route path="*">
            <Page404 />{" "}
          </Route>
        </Switch>
      </Router>
    </>
  );
};
export default AppRoutes;
