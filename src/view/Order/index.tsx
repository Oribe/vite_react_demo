/**
 * 列表页
 * URL: /tool/order
 */

import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import { FormInstance, message, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import ButtonGroups, { ButtonTypes } from "component/ButtonGroup";
import produce from "immer";
import { isEmpty } from "lodash-es";
import React, {
  FC,
  Key,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { errorMsg, successMsg } from "store/modules/global";
import {
  clearOrderList,
  collection,
  Cutter,
  deletedOrderAction,
  getHistoryOrderDetail,
  orderListSubmit,
  quantityChangeSave,
  saveUncompletedOrders,
} from "store/modules/order";
import EditableCell from "./components/editableCell";
import EditableRow from "./components/editableRow";
import style from "./index.module.scss";
import { buttonConfig, orderStore, publicColumnsType } from "./model";

/**
 * 订单列表
 */
const Order: FC = () => {
  const [selectedRows, setSelectedRows] = useState<Key[]>([]);
  const orderState = useSelector(orderStore);
  const dispatch = useDispatch();
  const history = useHistory();
  const cellFormRef = useRef<Map<string, FormInstance>>(new Map());
  const params = useParams<{ orderNo?: string }>();

  useEffect(() => {
    const { orderNo } = params;
    if (orderNo) {
      dispatch(getHistoryOrderDetail(orderNo));
    }
  }, [dispatch, params]);

  /**
   * 修改熟练保存
   */
  const handleTableChangeSave = useCallback(
    (values: Cutter) => {
      const { category, subCategory, orderNumber } = values;
      const index = orderState.orderList.findIndex(
        (item) =>
          item.category === category &&
          item.subCategory === subCategory &&
          item.orderNumber === orderNumber
      );
      const newValue = produce(orderState.orderList, (draft) => {
        draft.splice(index, 1, values);
        return draft;
      });
      dispatch(quantityChangeSave(newValue));
    },
    [dispatch, orderState.orderList]
  );

  const saveCellFormInstance = useCallback(
    (orderNumber: string) => (form: FormInstance) => {
      cellFormRef.current.set(orderNumber, form);
    },
    []
  );

  /**
   * table配置
   */
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
        onCell: (record) => ({
          record,
          editable: !isEmpty(record),
          dataIndex: "quantity",
          title: "数量",
          handleSave: handleTableChangeSave,
          getCellFormInstance: saveCellFormInstance(record.orderNumber),
        }),
      },
      {
        title: "操作",
        align: "center",
        render(_, record) {
          const { orderNo } = params;
          return (
            <Link
              to={{
                pathname: `/${orderNo ? "uncompleted" : "order"}${
                  orderNo ? `/${orderNo}` : ""
                }/edit/${record.subCategory}`,
                state: {
                  orderNumber: record.orderNumber,
                },
              }}
            >
              编辑
            </Link>
          );
        },
      },
    ];
    return cols.map((item) => ({ ...item, ...publicColumnsType }));
  }, [
    handleTableChangeSave,
    orderState.cutterCategory,
    params,
    saveCellFormInstance,
  ]);

  /**
   * 删除
   */
  const handleDeletedOrder = useCallback(() => {
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
  }, [dispatch, orderState.orderList, selectedRows]);

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
  const handleOrderListCollection = useCallback(async () => {
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
  }, [dispatch, orderState.orderList, selectedRows]);

  /**
   *
   */
  const handleValidate = async () => {
    const valideResult: Promise<unknown>[] = [];
    cellFormRef.current.forEach((form) => {
      valideResult.push(form.validateFields());
    });
    try {
      await Promise.all(valideResult);
      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * 提交
   */
  const handleSubmit = useCallback(async () => {
    const result = await handleValidate();
    if (!result) {
      message.warning("请将数量填写完整");
      return;
    }
    const response = await dispatch(orderListSubmit(orderState.orderList));
    if (isFulfilled(response)) {
      const { orderNo } = response.payload as { orderNo: string };
      message.success("提交成功", 1.5, () => {
        dispatch(clearOrderList());
        if (orderNo) {
          history.push(`/order/${orderNo}`);
        }
      });
    }
    if (isRejected(response)) {
      message.error("提交失败");
    }
  }, [dispatch, history, orderState.orderList]);

  /**
   * 暂存
   */
  const handleSave = useCallback(async () => {
    const result = await handleValidate();
    if (!result) {
      message.warning("请将数量填写完整");
      return;
    }
    const action = await dispatch(saveUncompletedOrders(orderState.orderList));
    if (isFulfilled(action)) {
      dispatch(successMsg("保存成功"));
    }
    if (isRejected(action)) {
      dispatch(errorMsg("保存失败"));
    }
  }, [dispatch, orderState.orderList]);

  /**
   * 按钮组配置
   */
  const buttons: ButtonTypes[] = useMemo(
    () => [
      {
        label: "添加",
        href: `${history.location.pathname}/add/257`,
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
        onClick: handleSave,
        disabled: orderState.orderList.length <= 0,
      },
      {
        label: "提交",
        type: "ghost",
        className: style.submitBut,
        onClick: handleSubmit,
        disabled: orderState.orderList.length <= 0,
      },
      {
        label: "下载文件示例",
        type: "link",
        className: style.downloadBut,
      },
    ],
    [
      handleDeletedOrder,
      handleOrderListCollection,
      handleSave,
      handleSubmit,
      history.location.pathname,
      orderState.orderList.length,
      selectedRows.length,
    ]
  );

  /**
   * 替换table中的内容
   */
  const component = useMemo(
    () => ({
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    }),
    []
  );

  return (
    <>
      <h3>订单编辑列表</h3>
      <Table
        className={style.orderTable}
        rowKey="orderNumber"
        columns={columns}
        scroll={{ x: true }}
        components={orderState.orderList.length ? component : undefined}
        dataSource={orderState.orderList || []}
        rowSelection={rowSelection}
      />
      <ButtonGroups config={buttonConfig} buttons={buttons} />
    </>
  );
};

export default Order;
