import "./index.css";
import React from "react";
import App from "./App";
import Html from "./Html"
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";

ReactDOM.hydrate(
  <Html>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Html>,
  document
);
