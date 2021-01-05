import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./layout/App";
import "./style/index.css";
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import { BrowserRouter } from "react-router-dom";
import { basename } from "./route";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
