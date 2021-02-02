import { Layout } from "antd";
import React from "react";
import Header from "../Header";
import Content from "../Content";
import style from "./index.module.scss";
import { router } from "route/index";

function App() {
  return (
    <Layout className={style.layout}>
      <Header />
      <Content routers={router} />
    </Layout>
  );
}

export default App;
