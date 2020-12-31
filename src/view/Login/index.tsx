import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Checkbox, Row, Col } from "antd";
import React, { FC, useState } from "react";
import style from "./index.module.scss";
const { Item } = Form;

const Login: FC<any> = () => {
  const [formAction] = useState("/tool/interface/login");

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };
  return (
    <Row justify="center" align="middle">
      <Col className={style.formWrapper}>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          action={formAction}
        >
          <Item>
            <h2 className={style.formTitle}>登录</h2>
          </Item>
          <Item
            name="userName"
            rules={[{ required: true, message: "请输入手机号!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="手机号"
            />
          </Item>
          <Item
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Item>
          <Item>
            <Button
              type="primary"
              htmlType="submit"
              className={style.loginFormButton}
            >
              登录
            </Button>
          </Item>
          <Item>
            <Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
