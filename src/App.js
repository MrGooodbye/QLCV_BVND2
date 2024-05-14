import "./App.scss";
import { ToastContainer, Zoom } from "react-toastify";
import React, { useEffect, useState, useContext } from "react";
import Header from "./components/Nav/Header";
import { BrowserRouter as Router } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./routes/AppRoutes";
import { useDispatch, useSelector } from "react-redux";
import { handleRefresh } from "./components/redux/actions/userAction";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import { UserContext } from './context/UserContext';
import ClipLoader from "react-spinners/ClipLoader";

function App() {
  const { user } = useContext(UserContext);

  const dispatch = useDispatch();
  const dataUserRedux = useSelector((state) => state.user.user);
  return (
    <>
      <Router>
        {user && user.isLoading ?
          <div className="loading-container">
            <ClipLoader
              color='rgba(54, 215, 183, 1)'
              size={150}
            />
            <div className="mt-1 ml-3">Đợi chờ là hạnh phúc...</div>
          </div>
          :
          <>
            <div className="app-container">
              <AppRoutes />
            </div>
          </>
        }

        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Zoom}
        />

      </Router>
    </>
  );
}

export default App;
