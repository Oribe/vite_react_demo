import React, { FC } from "react";
import { Col, Layout, Row } from "antd";
import style from "./index.module.scss";
import Logo from "/@assets/logo.png";

const Wrapper = Layout.Header;

const Header: FC<any> = () => {
  return (
    <Wrapper className={style.header}>
      <Row
        align="middle"
        justify="space-between"
        className={style.headerContent}
      >
        <Col span={20} className={style.titleWrapper}>
          <div className={style.logoWrapper}>
            <img src={Logo} alt="logo" />
          </div>
          <div className={style.title}>
            <h1>订单二维码管理工具</h1>
          </div>
        </Col>
        <Col span={4}>登陆状态</Col>
      </Row>
    </Wrapper>
  );
};

export default Header;
