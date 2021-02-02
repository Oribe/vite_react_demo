/**
 * 自定义表单
 */

import { Form as AForm } from "antd";
import React, { FC } from "react";
import { FormConfig } from "store/modules/Form";
import Caption from "./Caption";
import FormBody from "./FormBody";

const Form: FC<Props> = (props) => {
  const { config } = props;

  if (!config) {
    return <div>暂无数据</div>;
  }

  const { title, body } = config;

  console.log("config", config);

  return (
    <AForm>
      <h3>{title}</h3>
      <Caption />
      <FormBody body={body} />
    </AForm>
  );
};

export default Form;

interface Props {
  handleSearch: (orderNumber?: string) => void;
  config?: FormConfig;
}
