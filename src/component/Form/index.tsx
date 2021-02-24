/**
 * 自定义表单
 */

import { Button, Col, Form as AForm, message, Row } from "antd";
import React, { FC, memo } from "react";
import { FormConfig } from "store/modules/Form";
import Caption from "../FormCaption";
import FormBody from "../FormBody";
import styles from "./index.module.scss";
import { fromPairs, isEmpty } from "lodash-es";
import { Cutter } from "store/modules/order";
import { useHistory } from "react-router-dom";

const Form: FC<Props> = (props) => {
  const { config, onSearchOrderNumber, onAdd, onCollection } = props;
  const [form] = AForm.useForm<Cutter>();
  const history = useHistory();

  if (!config || isEmpty(config)) {
    console.log("暂无数据");
    return <div>暂无数据</div>;
  }

  const { title, decodeHintImgUrl, caption, body, others } = config;

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
   * 收藏
   */
  const handleCollection = async () => {
    const values = await form.validateFields();
    if (values && onCollection) {
      onCollection(values);
    }
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
      labelCol={{ span: 11, offset: 1 }}
      wrapperCol={{ span: 11, offset: 0 }}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
    >
      <h3>{title}</h3>
      <Row>
        <Caption
          config={caption}
          onFormReset={onFormReset}
          decodeHintImgUrl={decodeHintImgUrl}
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
          <Button type="primary" onClick={handleCollection}>
            收藏
          </Button>
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
  onCollection?: (order: Cutter) => void;
  onSearchOrderNumber?: (orderNumber?: string) => void;
}
