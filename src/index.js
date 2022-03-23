import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./assets/css/Header.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./store/store";
import { Provider } from "react-redux";
import { DAppProvider } from "@usedapp/core";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <DAppProvider config={{}}>
        <App />
      </DAppProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
