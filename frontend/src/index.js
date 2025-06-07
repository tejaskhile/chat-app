import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserProvider } from "./context/userContext";
import Home from "./pages/Home";
import Project from "./pages/Project";
import UserAuth from "./auth/UserAuth";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <UserProvider>
    <HashRouter basename="/chat-app">
      <App />
      <Routes>
        <Route
          path="/"
          element={
            <UserAuth>
              {" "}
              <Home />{" "}
            </UserAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/project"
          element={
            <UserAuth>
              {" "}
              <Project />{" "}
            </UserAuth>
          }
        />
      </Routes>
    </HashRouter>
  </UserProvider>
);
