import { Table } from "antd";
import { ButtonGroupProps } from "antd/lib/button";
import { ColumnsType, ColumnType } from "antd/lib/table";
import ButtonGroups, { ButtonTypes } from "component/ButtonGroup";
import React, { FC, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createSelector } from "reselect";
import { RootReducer } from "store/index";
import { getManufacturer } from "store/modules/form";
import { OrderState } from "store/modules/order";
import style from "./index.module.scss";

const publicColumnsType: ColumnType<any> = {
  align: "center",
  className: style.tableColumns,
};

const buttonConfig: ButtonGroupProps = {
  // size: "large",
  className: style.btnGroup,
};

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

const orderStore = createSelector<RootReducer, OrderState, OrderState>(
  (store) => store.order,
  (order) => order
);

const Order: FC = () => {
  const orderState = useSelector(orderStore);
  const dispatch = useDispatch();
  const columns = useMemo<ColumnsType<any>>(() => {
    const cols: ColumnsType<any> = [
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
        render() {
          return <Link to="/order/edit/:orderNumber">编辑</Link>;
        },
      },
    ];
    return cols.map((item) => ({ ...item, ...publicColumnsType }));
  }, []);

  useEffect(() => {
    dispatch(getManufacturer());
  }, [dispatch]);

  return (
    <>
      <h3>订单编辑列表</h3>
      <Table
        className={style.orderTable}
        columns={columns}
        dataSource={orderState.orderList || []}
      />
      <ButtonGroups config={buttonConfig} buttons={buttons} />
    </>
  );
};

export default Order;
