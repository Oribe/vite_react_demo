import { isFulfilled } from "@reduxjs/toolkit";
import { Button, Col, Form, Input, Row } from "antd";
import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { userInfoUpdate } from "store/modules/user";
import styles from "./index.module.scss";
import userStore from "./model";

const { Item } = Form;

const User: FC = () => {
  const userInfo = useSelector(userStore);
  const [form] = Form.useForm<FormStore>();
  const history = useHistory();
  const dispatch = useDispatch();

  const onFinish = async (values: FormStore) => {
    const status = await dispatch(userInfoUpdate({ ...userInfo, ...values }));
    if (isFulfilled(status)) {
      history.push("./order");
    }
  };

  const goback = () => {
    history.goBack();
  };

  return (
    <>
      <h1 className={styles.title}>用户信息</h1>
      <Row justify="center">
        <Col xs={24} sm={14} md={14} lg={12} xl={9}>
          <Form
            form={form}
            labelCol={{ span: 5 }}
            onFinish={onFinish}
            initialValues={userInfo}
          >
            <Item
              label="供应商名称"
              name="supplier"
              required
              rules={[{ required: true, message: "不能为空" }]}
            >
              <Input />
            </Item>
            <Item
              label="联系人"
              name="contact"
              required
              rules={[{ required: true, message: "不能为空" }]}
            >
              <Input />
            </Item>
            <Item
              label="联系电话"
              name="mobile"
              required
              rules={[
                { required: true, message: "不能为空" },
                {
                  pattern: /^(\+?0?86\\-?)?1[3-9]\d{9}$/,
                  message: "请输入正确的手机号",
                },
              ]}
            >
              <Input />
            </Item>
            <Item
              wrapperCol={{
                sm: {
                  offset: 5,
                },
              }}
            >
              <div style={{ position: "relative" }}>
                <Button
                  className={styles.btnSubmit}
                  type="primary"
                  htmlType="submit"
                >
                  保存用户信息
                </Button>
                <Button
                  className={styles.btnBack}
                  type="ghost"
                  onClick={goback}
                >
                  返回
                </Button>
              </div>
            </Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default User;

interface FormStore {
  supplier: string;
  contact: string;
  mobile: string;
}
