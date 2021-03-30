import { Button, message, Table } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import Search from "component/Search";
import React, { FC, Key, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getHistoryOrder,
  HistoryOrder,
  recreateOrder,
  TimeRangeParam,
} from "store/modules/order";
import styles from "./index.module.scss";
import historyStore from "./model";

const publicColumnsType: ColumnType<any> = {
  align: "center",
  className: styles.tableColumns,
};

const History: FC = () => {
  const dispatch = useDispatch();
  const historyState = useSelector(historyStore);
  const [timeRange, setTimeRange] = useState<TimeRangeParam>({});
  const [selectedOrderNo, setSelectedOrderNo] = useState<Key>();

  const onSearch = useCallback(() => {
    dispatch(getHistoryOrder(timeRange));
  }, [dispatch, timeRange]);

  /**
   * table列配置
   */
  const columns = useMemo(() => {
    const columnsTypes: ColumnsType<HistoryOrder> = [
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
        render: (_, record) => {
          return <Link to={`/history/${record.orderNo}`}>详情</Link>;
        },
      },
    ];
    return columnsTypes.map((item) => ({ ...item, ...publicColumnsType }));
  }, []);

  const rowSelection: TableRowSelection<HistoryOrder> = {
    type: "radio",
    onChange(selectedRowKeys: Key[]) {
      setSelectedOrderNo(selectedRowKeys[0]);
    },
  };

  const handleSearchValueChange = useCallback((value: TimeRangeParam) => {
    setTimeRange(value);
  }, []);

  /**
   * 续建订单
   */
  const onRecreateOrder = useCallback(async () => {
    if (!selectedOrderNo) {
      message.warning("请先选择一个订单");
      return;
    }
    dispatch(recreateOrder(selectedOrderNo));
  }, [dispatch, selectedOrderNo]);
  const recreateButton = useMemo(() => {
    return (
      <Button type="primary" onClick={onRecreateOrder}>
        续建订单
      </Button>
    );
  }, [onRecreateOrder]);

  return (
    <>
      <Search onSearch={onSearch} onChange={handleSearchValueChange}>
        {recreateButton}
      </Search>
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
