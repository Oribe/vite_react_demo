/**
 * 表单头
 * 固定参数
 */

import React, { FC, useCallback } from "react";
import { AutoComplete, Input, Row } from "antd";
import FormItem from "../FormItem";

const Caption: FC<Props> = (props) => {
  const { handleSearch } = props;
  /**
   * 远端查询订货号
   * 模糊查询
   * 返回对应的订货号列表
   */
  const onSearch = useCallback(
    (value: string) => {
      if (handleSearch) {
        handleSearch(value);
      }
    },
    [handleSearch]
  );

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
  handleSearch?: (orderNumber: string) => void;
}
