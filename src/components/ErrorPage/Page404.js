import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "../ErrorPage/Page500.scss";
const Page404 = () => {
  let history = useHistory();
  const handleBack = () => {
    history.push("/");
  };
  return (
    <div>
      <div className="section">
        <h1 className="error">404</h1>
        <div className="page">
          Đường dẫn mà bạn đang vào hiện không tồn tại.
        </div>
        <div>
          <a className="back-home" onClick={() => handleBack()}>
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
};
export default Page404;
