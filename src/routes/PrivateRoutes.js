import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserContext } from '../context/UserContext';

const PrivateRoutes = (props) => {
  const { user } = useContext(UserContext);

  if (user && user.isAuthenticated === true) {
    return (
      <>
        <Route path={props.path} component={props.component}></Route>
      </>
    );
  }
  else {
    return (
      <>
        <Redirect to='/login-user'></Redirect>
      </>
    )
  }
};
export default PrivateRoutes;
