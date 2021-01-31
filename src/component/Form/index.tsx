/**
 * 自定义表单
 */

import { Form as AForm } from "antd";
import React, { FC } from "react";
import { FormConfig } from "store/modules/Form";

const Form: FC<Props> = (props) => {
  const { config } = props;

  console.log("config", config);

  return <AForm>表单</AForm>;
};

export default Form;

interface Props {
  config?: FormConfig;
}
