/**
 * 自定义表单
 */

import { Form as AForm, Row } from "antd";
import React, { FC } from "react";
import { FormConfig } from "store/modules/Form";
import Caption from "../FormCaption";
import FormBody from "../FormBody";

const Form: FC<Props> = (props) => {
  const { config, handleSearch } = props;

  if (!config) {
    return <div>暂无数据</div>;
  }

  const { title, body } = config;

  return (
    <AForm
      labelCol={{ span: 10, offset: 1 }}
      wrapperCol={{ span: 12, offset: 0 }}
    >
      <h3>{title}</h3>
      <Row>
        <Caption handleSearch={handleSearch} />
        <FormBody body={body} />
      </Row>
    </AForm>
  );
};

export default Form;

interface Props {
  handleSearch: (orderNumber?: string) => void;
  config?: FormConfig;
}
