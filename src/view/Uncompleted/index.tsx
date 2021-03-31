/**
 * 未完成订单
 */
import { isFulfilled } from "@reduxjs/toolkit";
import { Button, Row, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import Search from "component/Search";
import React, { FC, Key, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteUncompletedOrders,
  getUncompletedOrders,
  submitUncompletedOrder,
  TimeRangeParam,
  UncompletedOrder,
} from "store/modules/order";
import uncompletedState from "./model";

const Uncompleted: FC = () => {
  const [condition, setCondition] = useState<TimeRangeParam>({});
  const [selectedKey, setSelectedKey] = useState<Key[]>([]);

  const state = useSelector(uncompletedState);
  const dispatch = useDispatch();

  const columns = useMemo<ColumnsType<UncompletedOrder>>(() => {
    return [
      {
        title: "订单流水号",
        dataIndex: "orderNo",
        align: "center",
      },
      {
        title: "型号数量",
        dataIndex: "modelNumber",
        align: "center",
      },
      {
        title: "订单总数",
        dataIndex: "quantity",
        align: "center",
      },
      {
        title: "保存日期",
        dataIndex: "createAt",
        align: "center",
      },
      {
        title: "操作",
        dataIndex: "action",
        render(_, record) {
          return <Link to={`/uncompleted/${record.orderNo}`}>编辑</Link>;
        },
      },
    ];
  }, []);
  const rowSelection = useMemo<TableRowSelection<UncompletedOrder>>(() => {
    return {
      type: "radio",
      onChange(selectedRowKeys) {
        setSelectedKey(selectedRowKeys);
      },
    };
  }, []);

  /**
   * 筛选时间发生变化
   */
  const onChange = useCallback((value) => {
    setCondition((prev) => ({ ...prev, ...value }));
  }, []);

  /**
   * 搜索
   */
  const onSearch = useCallback(() => {
    dispatch(getUncompletedOrders(condition));
  }, [condition, dispatch]);

  /**
   * 提交
   */
  const onSubmit = useCallback(async () => {
    const response = await dispatch(submitUncompletedOrder(selectedKey));
    if (isFulfilled(response)) {
      dispatch(onSearch());
    }
  }, [dispatch, onSearch, selectedKey]);

  /**
   * 刪除
   */
  const onDelete = useCallback(async () => {
    const response = await dispatch(deleteUncompletedOrders(selectedKey));
    if (isFulfilled(response)) {
      onSearch();
    }
  }, [dispatch, onSearch, selectedKey]);

  return (
    <>
      <Search onSearch={onSearch} onChange={onChange} />
      <Table
        rowKey="id"
        columns={columns}
        rowSelection={rowSelection}
        loading={state.loading}
        dataSource={state.data}
        scroll={{ x: true }}
      />
      <Row justify="center">
        <Space align="center" size="large" style={{ marginTop: 16 }}>
          <Button type="primary" danger size="middle" onClick={onDelete}>
            删除
          </Button>
          <Button size="middle" type="primary" ghost onClick={onSubmit}>
            提交
          </Button>
        </Space>
      </Row>
    </>
  );
};

export default Uncompleted;
