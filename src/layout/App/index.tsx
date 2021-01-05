import { Layout } from "antd";
import React from "react";
import Header from "../Header";
import Content from "../Content";
import style from "./index.module.scss";
import "antd/dist/antd.css";

function App() {
  return (
    <Layout className={style.layout}>
      <Header />
      <Content />
    </Layout>
  );
}

export default App;
