import { Col, Layout, Row } from "antd";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSelector } from "reselect";
import style from "./index.module.scss";
import Logo from "/@assets/logo.png";
import { RootReducer } from "/@store/index";
import { UserInfo, UserState } from "/@store/modules/user";

const Wrapper = Layout.Header;

const userStore = createSelector<RootReducer, UserState, UserInfo>(
  (store) => store.user,
  (userState) => userState.get("userInfo")
);

const Header: FC = () => {
  const userInfo = useSelector(userStore);
  const history = useHistory();

  useEffect(() => {
    if (userInfo.id) {
      history.push("http://localhost:4000/");
    }
  }, [history, userInfo.id]);

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
