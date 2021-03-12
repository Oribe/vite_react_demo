/**
 * 列表页
 * URL: /tool/order
 */

import { message, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import ButtonGroups, { ButtonTypes } from "component/ButtonGroup";
import React, { FC, Key, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { collection, Cutter, deletedOrderAction } from "store/modules/order";
import style from "./index.module.scss";
import { buttonConfig, orderStore, publicColumnsType } from "./model";

/**
 * 订单列表
 */
const Order: FC = () => {
  const [selectedRows, setSelectedRows] = useState<Key[]>([]);
  const orderState = useSelector(orderStore);
  const dispatch = useDispatch();
  const columns = useMemo<ColumnsType<Cutter>>(() => {
    const cols: ColumnsType<Cutter> = [
      {
        title: "刀具子类",
        dataIndex: "subCategory",
        align: "center",
        className: style.tableColumns,
        render(value, record) {
          const category = orderState.cutterCategory.find(
            (item) => item.category === record.category
          );
          const subCategory = category?.subCategory.find(
            (item) => item.subCategory === value
          );
          return subCategory?.name ?? value;
        },
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
  }, [orderState.cutterCategory]);

  /**
   * 删除
   */
  const handleDeletedOrder = () => {
    if (selectedRows.length <= 0) {
      message.warning("请先选择要删除的刀具");
      return;
    }
    const result = dispatch(deletedOrderAction(selectedRows));
    const idx = orderState.orderList.findIndex((item) =>
      result.payload.includes(item.orderNumber)
    );
    if (idx < 0) {
      message.success("删除成功");
      setSelectedRows([]);
      return;
    }
    message.success("删除失败");
  };

  /**
   * 选项
   */
  const rowSelection: TableRowSelection<Cutter> = {
    type: "checkbox",
    onChange: (selectedRowKeys) => {
      setSelectedRows(selectedRowKeys);
    },
  };

  /**
   * 收藏
   */
  const handleOrderListCollection = async () => {
    if (selectedRows.length <= 0) {
      message.warning("请先选择要收藏的刀具");
      return;
    }
    const willCollectionCutters = orderState.orderList.reduce<Cutter[]>(
      (n, c) => {
        if (selectedRows.includes(c.orderNumber)) {
          n.push(c);
        }
        return n;
      },
      []
    );
    if (willCollectionCutters.length !== selectedRows.length) {
      message.error("收藏失败");
      return;
    }
    dispatch(collection(willCollectionCutters));
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
      onClick: handleOrderListCollection,
      disabled: selectedRows.length <= 0,
    },
    {
      label: "删除",
      onClick: handleDeletedOrder,
      disabled: selectedRows.length <= 0,
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
