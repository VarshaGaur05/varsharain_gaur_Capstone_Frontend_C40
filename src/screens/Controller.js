import React from "react";
import Home from "../screens/home/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const Controller = () => {
  const baseUrl = "http://localhost:8080/";
  const {authIsReady} = useAuthContext()
  return (
    <Router>
      <div className="main-container">
      {authIsReady && (
        <Route
          exact
          path="/"
          render={(props) => <Home {...props} baseUrl={baseUrl} />}
        />
        )}
      </div>
    </Router>
  );
};

export default Controller;
