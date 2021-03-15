import { Layout } from "antd";
import React from "react";
import { router } from "route/index";
import style from "./index.module.scss";
import Header from "../Header";
import Content from "../Content";

function App() {
  return (
    <Layout className={style.layout}>
      <Header />
      <Content routers={router} />
    </Layout>
  );
}

export default App;
