import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import { message, Table } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import React, { FC, Key, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getHistoryOrder,
  HistoryOrder,
  historyOrderDetail,
} from "store/modules/order";
import Search, { TimeRange } from "./component/Search";
import styles from "./index.module.scss";
import historyStore from "./model";

const publicColumnsType: ColumnType<any> = {
  align: "center",
  className: styles.tableColumns,
};

const History: FC = () => {
  const dispatch = useDispatch();
  const historyState = useSelector(historyStore);
  const [timeRange, setTimeRange] = useState<TimeRange>({});
  const [selectedOrderNo, setSelectedOrderNo] = useState<Key>();

  const onSearch = () => {
    dispatch(getHistoryOrder(timeRange));
  };

  /**
   * table列配置
   */
  const columns: ColumnsType<HistoryOrder> = [
    {
      title: "订单流水号",
      dataIndex: "orderNo",
    },
    {
      title: "型号数量",
      dataIndex: "modelNumber",
    },
    {
      title: "生成日期",
      dataIndex: "createAt",
    },
    {
      title: "操作",
      dataIndex: "action",
      render() {
        return <Link to="/">详情</Link>;
      },
    },
  ].map((item) => ({ ...item, ...publicColumnsType }));

  const rowSelection: TableRowSelection<HistoryOrder> = {
    type: "radio",
    onChange(selectedRowKeys: Key[]) {
      setSelectedOrderNo(selectedRowKeys[0]);
    },
  };

  const handleSearchValueChange = (value: TimeRange) => {
    setTimeRange(value);
  };

  const recreateOrder = useCallback(async () => {
    if (!selectedOrderNo) {
      message.warning("请先选择一个订单");
      return;
    }
    const response = await dispatch(historyOrderDetail(selectedOrderNo));
    if (isFulfilled(response)) {
      console.log(response);
    }
    if (isRejected(response)) {
      console.log(response);
    }
  }, [dispatch, selectedOrderNo]);

  return (
    <>
      <Search
        onSearch={onSearch}
        onChange={handleSearchValueChange}
        onRecreate={recreateOrder}
      />
      <Table
        className={styles.historyTable}
        rowKey="orderNo"
        columns={columns}
        scroll={{ x: true }}
        rowSelection={rowSelection}
        loading={historyState.loading}
        dataSource={historyState.data}
      />
    </>
  );
};

export default History;
