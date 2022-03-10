import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/bootstrap.css";
import "./index.css";
import "./assets/css/Header.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { store } from "./store/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />,
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
