/**
 * 自定义表单
 */

import { Button, Col, Empty, Form as AForm, message, Row } from "antd";
import Loading from "component/Loading";
import { DebouncedFunc, isEmpty } from "lodash-es";
import React, { FC, memo, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FormConfig } from "store/modules/form";
import { Cutter } from "store/modules/order";
import FormBody from "../FormBody";
import Caption from "../FormCaption";
import styles from "./index.module.scss";

const Form: FC<Props> = (props) => {
  const {
    config,
    onSearchOrderNumber,
    onAdd,
    onCollection,
    loading,
    initialValue,
    listUrl,
  } = props;
  const [form] = AForm.useForm<Cutter>();
  const history = useHistory();

  /**
   * 订单搜索后选择某个订单
   */
  const onSelectOneOfOrderNumber = useCallback(
    (value: string) => {
      if (value) {
        try {
          const valueObj = JSON.parse(value);
          delete valueObj.createAt;
          delete valueObj.updateAt;
          form.setFieldsValue(valueObj);
        } catch (e) {
          // throw e;
          console.error(e);
        }
      }
    },
    [form]
  );

  /**
   * 设置默认值
   */
  useEffect(() => {
    if (initialValue) {
      form.setFieldsValue(initialValue);
    }
  }, [form, initialValue]);

  if (loading) {
    /**
     * 配置加载中
     */
    return <Loading tip="loading..." />;
  }

  if (!config || isEmpty(config)) {
    /**
     * 如果配置不存在
     */
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const { title, decodeHintImgUrl, caption, body, others } = config;

  /**
   * 提交前，将组合字段添加到刀具信息
   */
  const beforeAdd = (values: Cutter) => {
    const valuesCopy = values;
    [...caption, ...body].forEach((item) => {
      const {
        dataIndex,
        component: { type },
        complexConfig,
      } = item;
      if (type.toLowerCase() !== "complex") {
        return;
      }
      if (
        dataIndex &&
        complexConfig &&
        Array.isArray(complexConfig) &&
        complexConfig.length
      ) {
        const value = complexConfig.reduce((v, c) => {
          let vCopy = v;
          const { dataIndex: dx } = c;
          if (dx) {
            vCopy += values[dx] ?? "";
          }
          return vCopy;
        }, "");
        valuesCopy[dataIndex] = value;
      }
    });
    return valuesCopy;
  };

  /**
   * 确认添加
   */
  const handleFinish = (values: Cutter) => {
    if (!onAdd) {
      return;
    }
    const newValues = beforeAdd(values);
    onAdd(newValues).then(() => {
      form.resetFields();
    });
  };

  /**
   * 表单验证失败
   */
  const handleFinishFailed = (errorInfo: unknown) => {
    console.error(errorInfo);
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
    if (listUrl) {
      history.push(listUrl);
    }
  };

  /**
   * 收藏
   */
  const handleCollection = async () => {
    const values = await form.validateFields();
    const newValues = beforeAdd(values);
    if (values && onCollection) {
      onCollection(newValues);
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
        history.push(`/order/add/${others.matchCutter}`);
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
          onSelectOneOfOrderNumber={onSelectOneOfOrderNumber}
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
  onAdd?: (order: Cutter) => Promise<boolean>;
  onCollection?: (order: Cutter) => void;
  onSearchOrderNumber?: (orderNumber?: string) => Promise<unknown>;
  loading?: boolean;
  initialValue?: Cutter;
  listUrl?: string;
}
