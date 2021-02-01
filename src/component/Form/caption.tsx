/**
 * 表单头
 * 固定参数
 */

import React, { FC } from "react";
import { AutoComplete, Input, Row } from "antd";
import FormItem from "./formItem";

const Caption: FC = () => {
  const onSearch = (value: string) => {};

  return (
    <Row>
      <FormItem label="制造商" dataIndex="manufacturer" required>
        <Input placeholder="请选择制造商" />
      </FormItem>
      <FormItem label="订货号" dataIndex="orderNumber" required>
        <AutoComplete placeholder="请输入订货号" onSearch={onSearch} />
      </FormItem>
    </Row>
  );
};

export default Caption;

interface Props {
  handleSearch: () => {};
}
