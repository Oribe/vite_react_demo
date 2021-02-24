/**
 * 自定义表单
 */

import { Button, Col, Form as AForm, message, Row } from "antd";
import React, { FC, memo } from "react";
import { FormConfig } from "store/modules/Form";
import Caption from "../FormCaption";
import FormBody from "../FormBody";
import styles from "./index.module.scss";
import { isEmpty } from "lodash-es";
import { Cutter } from "store/modules/order";
import { useHistory } from "react-router-dom";

const Form: FC<Props> = (props) => {
  const { config, onSearchOrderNumber, onAdd } = props;
  const [form] = AForm.useForm<Cutter>();
  const history = useHistory();

  if (!config || isEmpty(config)) {
    console.log("暂无数据");
    return <div>暂无数据</div>;
  }

  const { title, caption, body, others } = config;

  /**
   * 确认添加
   */
  const handleFinish = (values: Cutter) => {
    if (onAdd) {
      onAdd(values);
      form.resetFields();
    }
  };

  const handleFinishFailed = (errorInfo: unknown) => {
    console.error("errorInfo", errorInfo);
  };

  /**
   * 表单重置
   */
  const onFormReset = () => {
    form.resetFields();
  };

  /**
   * 返回列表
   */
  const gobackToOrderList = () => {
    history.push("/order");
  };

  /**
   * 添加并跳转到匹配的刀具
   */
  const addAndSwitchMatchCutter = async () => {
    if (others && others.matchCutter) {
      const values = await form.validateFields();
      if (values) {
        handleFinish(values);
        history.push("/order/add/" + others.matchCutter);
      }
      return;
    }
    message.warning("没有匹配的刀具");
  };

  return (
    <AForm
      form={form}
      labelCol={{ span: 10, offset: 1 }}
      wrapperCol={{ span: 12, offset: 0 }}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
    >
      <h3>{title}</h3>
      <Row>
        <Caption
          config={caption}
          onFormReset={onFormReset}
          onSearchOrderNumber={onSearchOrderNumber}
        />
        <FormBody body={body} />
      </Row>
      <Row className={styles.btnGroup} justify="center" wrap>
        <Col className={styles.formBtn} xs={12} sm={6}>
          <Button type="primary" htmlType="submit">
            确认添加
          </Button>
        </Col>
        <Col className={styles.formBtn} xs={12} sm={6}>
          <Button type="primary" onClick={addAndSwitchMatchCutter}>
            确认并添加匹配刀片
          </Button>
        </Col>
        <Col className={styles.formBtn} xs={12} sm={6}>
          <Button type="primary">收藏</Button>
        </Col>
        <Col className={styles.formBtn} xs={12} sm={6}>
          <Button onClick={gobackToOrderList}>查看列表</Button>
        </Col>
      </Row>
    </AForm>
  );
};

export default memo(Form);

interface Props {
  config?: FormConfig;
  onAdd?: (order: Cutter) => void;
  onSearchOrderNumber?: (orderNumber?: string) => void;
}
