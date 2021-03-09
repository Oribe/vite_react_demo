/**
 * 列表页
 * URL: /tool/order
 */

import { Table } from "antd";
import { ButtonGroupProps } from "antd/lib/button";
import { ColumnsType, ColumnType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import ButtonGroups, { ButtonTypes } from "component/ButtonGroup";
import React, { FC, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createSelector } from "reselect";
import { RootReducer } from "store/index";
import { Cutter, deletedOrderAction, OrderState } from "store/modules/order";
import style from "./index.module.scss";

const publicColumnsType: ColumnType<any> = {
  align: "center",
  className: style.tableColumns,
};

const buttonConfig: ButtonGroupProps = {
  // size: "large",
  className: style.btnGroup,
};

const orderStore = createSelector<RootReducer, OrderState, OrderState>(
  (store) => store.order,
  (order) => order
);

/**
 * 订单列表
 */
const Order: FC = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const orderState = useSelector(orderStore);
  const dispatch = useDispatch();
  const columns = useMemo<ColumnsType<Cutter>>(() => {
    const cols: ColumnsType<Cutter> = [
      {
        title: "刀具子类",
        dataIndex: "subCategory",
        align: "center",
        className: style.tableColumns,
      },
      {
        title: "订货号",
        dataIndex: "orderNumber",
        align: "center",
        className: style.tableColumns,
      },
      {
        title: "制造商",
        dataIndex: "manufacturer",
        align: "center",
        className: style.tableColumns,
      },
      {
        title: "数量",
        dataIndex: "quantity",
        align: "center",
        className: style.tableColumns,
      },
      {
        title: "操作",
        align: "center",
        render(_, record) {
          return (
            <Link
              to={{
                pathname: `/order/edit/${record.subCategory}`,
                state: { orderNumber: record.orderNumber },
              }}
            >
              编辑
            </Link>
          );
        },
      },
    ];
    return cols.map((item) => ({ ...item, ...publicColumnsType }));
  }, []);

  /**
   * 删除
   */
  const handleDeletedOrder = () => {
    const result = dispatch(deletedOrderAction(selectedRows));
    console.log(result);
  };

  /**
   * 选项
   */
  const rowSelection: TableRowSelection<Cutter> = {
    type: "checkbox",
    onSelect: (record, selected, selectedRows) => {
      const orderNumberRows = selectedRows.map((item) => item.orderNumber);
      setSelectedRows(orderNumberRows);
    },
  };

  /**
   * 按钮组配置
   */
  const buttons: ButtonTypes[] = [
    {
      label: "添加",
      href: "/order/add/257",
    },
    {
      label: "收藏夹导入",
    },
    {
      label: "文件导入",
    },
    {
      label: "收藏",
    },
    {
      label: "删除",
      onClick: handleDeletedOrder,
    },
    {
      label: "暂存",
    },
    {
      label: "提交",
      type: "ghost",
      className: style.submitBut,
    },
    {
      label: "下载文件示例",
      type: "link",
      className: style.downloadBut,
    },
  ];

  return (
    <>
      <h3>订单编辑列表</h3>
      <Table
        className={style.orderTable}
        rowKey="orderNumber"
        columns={columns}
        dataSource={orderState.orderList || []}
        rowSelection={rowSelection}
      />
      <ButtonGroups config={buttonConfig} buttons={buttons} />
    </>
  );
};

export default Order;
