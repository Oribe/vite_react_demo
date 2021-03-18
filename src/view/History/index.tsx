import { Table } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHistoryOrder } from "store/modules/order";
import Search from "./component/Search/search";
import styles from "./index.module.scss";
import historyStore from "./model";

const publicColumnsType: ColumnType<any> = {
  align: "center",
  className: styles.tableColumns,
};

const History: FC = () => {
  const dispatch = useDispatch();
  const historyState = useSelector(historyStore);

  const onSearch = () => {
    dispatch(getHistoryOrder({}));
  };

  /**
   * table列配置
   */
  const columns: ColumnsType<any> = [
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
    },
  ].map((item) => ({ ...item, ...publicColumnsType }));

  return (
    <>
      <Search onSearch={onSearch} />
      <Table
        className={styles.historyTable}
        columns={columns}
        loading={historyState.loading}
        dataSource={historyState.data}
      />
    </>
  );
};

export default History;
