import { Col, Layout, Row } from "antd";
import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createSelector } from "reselect";
import Logo from "assets/logo.png";
import { RootReducer } from "store/index";
import { UserState } from "store/modules/user";
import style from "./index.module.scss";
import LoginStatus from "./LoginStatus";

const Wrapper = Layout.Header;

const userState = createSelector<RootReducer, UserState, UserState>(
  (store) => store.user,
  (user) => user
);

/**
 * 头部
 */
const Header: FC = () => {
  const userStore = useSelector(userState);
  const history = useHistory();

  const { isLogin, userInfo } = userStore;
  useEffect(() => {
    if (isLogin) {
      /**
       * 登陆直接跳转
       */
      // window.location.href = "http://localhost:4000/tool/order";
      history.push("/");
    } else {
      /**
       * 未登录跳转到登陆页面
       */
      history.push("/login");
    }
  }, [history, isLogin, userStore]);

  return (
    <Wrapper className={style.header}>
      <Row
        align="middle"
        justify="space-between"
        className={style.headerContent}
      >
        <Col className={style.titleWrapper}>
          <div className={style.logoWrapper}>
            <img src={Logo} alt="logo" />
          </div>
          <div className={style.title}>
            <h1>订单二维码管理工具</h1>
          </div>
        </Col>
        <Col xs={0} md={6} className={style.userWrapper}>
          <LoginStatus isLogin={isLogin} userInfo={userInfo} />
        </Col>
        <Col md={0}>头像</Col>
      </Row>
    </Wrapper>
  );
};

export default Header;
