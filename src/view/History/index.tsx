import { Table } from "antd";
import { ColumnsType, ColumnType } from "antd/lib/table";
import React, { FC } from "react";

import style from "./index.module.scss";

const publicColumnsType: ColumnType<any> = {
  align: "center",
  className: style.tableColumns,
};

const History: FC = () => {
  const columns: ColumnsType<any> = [
    {
      title: "订单流水号",
      dataIndex: "orderNo",
    },
    {
      title: "型号数量",
      dataIndex: "count",
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
      <Table className={style.historyTable} columns={columns} />
    </>
  );
};

export default History;
