/**
 * 表单头
 * 固定参数
 */

import React, { FC, useCallback } from "react";
import { AutoComplete, Col, Input } from "antd";
import FormItem from "../FormItem";
import { debounce } from "lodash-es";

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
    <>
      <Col xs={24} sm={12} md={12}>
        <FormItem label="制造商" name="manufacturer" required>
          <Input placeholder="请选择制造商" />
        </FormItem>
      </Col>
      <Col xs={24} sm={12} md={12}>
        <FormItem label="订货号" name="orderNumber" required>
          <AutoComplete
            placeholder="请输入订货号"
            onSearch={debounce(onSearch, 1000)}
          />
        </FormItem>
      </Col>
    </>
  );
};

export default Caption;

interface Props {
  handleSearch?: (orderNumber: string) => void;
}
