import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Popover, Row, Space } from "antd";
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { UserInfo } from "store/modules/user";
import style from "./index.module.scss";

const LoginStatus: FC<Props> = (props: Props) => {
  const [visible, setVisible] = useState(false);
  const { isLogin, userInfo } = props;
  if (!isLogin) {
    return null;
  }
  const { mobile } = userInfo;

  const handleVisibleChange = (vis: boolean) => {
    setVisible(vis);
  };

  const hanldeVisibleClose = () => {
    setVisible(false);
  };

  const onLogout = () => {
    //
  };

  const porpoverContent = () => (
    <div onClick={hanldeVisibleClose} aria-hidden="true">
      <Col className={style.porConent}>
        <Link to="/user">个人信息</Link>
      </Col>
      <Col className={style.porConent}>
        <Button type="link" onClick={onLogout}>
          登出
        </Button>
      </Col>
    </div>
  );

  return mobile ? (
    <Row>
      <Col xs={0} md={24}>
        <Space align="center">
          <div>
            <span>用户名：</span>
            <Link to="/user" style={{ color: "#000" }}>
              {mobile}
            </Link>
          </div>
          <span>|</span>
          <Button type="link" className={style.btnLogout} onClick={onLogout}>
            退出
          </Button>
        </Space>
      </Col>
      <Col md={0}>
        <Popover
          trigger="click"
          content={porpoverContent}
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ marginRight: "10px" }}
          />
        </Popover>
      </Col>
    </Row>
  ) : null;
};

export default LoginStatus;

interface Props {
  userInfo: UserInfo;
  isLogin: boolean;
}
