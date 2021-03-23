/**
 * 订单详情
 * 打印二维码
 * 导出pdf
 */

import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import { Col, Row, Spin, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { errorMsg } from "store/modules/global";
import {
  historyOrderDetail,
  OrderItemsType,
  SubmitOrderType,
} from "store/modules/order";
import { getCutterNameFromMenus } from "utils/index";
import { getCutterDataIndexs } from "store/modules/form";
import orderDetailState from "./model";
import styles from "./index.module.scss";

const OrderDetail: FC = () => {
  const param = useParams<{ orderNo: string }>();
  const state = useSelector(orderDetailState);
  const [dataSource, setDataSource] = useState<SubmitOrderType>();
  const [loading, setLoading] = useState(true);
  const [dataIndexList, setDataIndexList] = useState<Record<number, string[]>>(
    {}
  );
  const dispatch = useDispatch();

  const getDataIndexList = useCallback(
    async (subCategoryList: number[]) => {
      const action = await dispatch(getCutterDataIndexs(subCategoryList));
      if (isFulfilled(action)) {
        setDataIndexList(action.payload as Record<number, string[]>);
      }
      if (isRejected(action)) {
        dispatch(errorMsg("生成二维失败"));
      }
    },
    [dispatch]
  );

  const getData = useCallback(async () => {
    const actions = await dispatch(historyOrderDetail(param.orderNo));
    if (isRejected(actions)) {
      dispatch(errorMsg(actions.error.message || "请求失败"));
      setLoading(false);
    }
    if (isFulfilled(actions)) {
      const payload = actions.payload as SubmitOrderType;
      const subCategoryList = payload.orders.map((item) => item.subCategory);
      await getDataIndexList(subCategoryList);
      setDataSource(payload);
      setLoading(false);
    }
  }, [dispatch, getDataIndexList, param.orderNo]);

  useEffect(() => {
    getData();
  }, [getData]);

  const columns = useMemo(() => {
    const columnsTypes: ColumnsType<OrderItemsType> = [
      {
        title: "序号",
        dataIndex: "id",
        align: "center",
        render(v, r, index) {
          return index + 1;
        },
      },
      {
        title: "刀具子类",
        align: "center",
        dataIndex: "subCategory",
        render(subCategory, record) {
          return getCutterNameFromMenus(
            record.category,
            subCategory,
            state.cutters
          );
        },
      },
      {
        title: "订货号",
        align: "center",
        dataIndex: "orderNumber",
      },
      {
        title: "制造商",
        dataIndex: "manufacturer",
        align: "center",
      },
      {
        title: "数量",
        dataIndex: "quantity",
        align: "center",
      },
    ];
    return columnsTypes;
  }, [state.cutters]);

  return (
    <Spin spinning={loading}>
      {dataSource ? (
        <Row className={styles.orderInfoTitle} justify="space-between">
          <Col>订单流水号:{dataSource?.orderNo}</Col>
          <Col>供应商:{dataSource?.supplier}</Col>
          <Col>创建日期:{dataSource?.createAt}</Col>
        </Row>
      ) : null}
      <Table
        rowKey="orderNumber"
        columns={columns}
        dataSource={dataSource?.orders}
      />
    </Spin>
  );
};

export default OrderDetail;
