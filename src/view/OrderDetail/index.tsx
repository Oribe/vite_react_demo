/**
 * 订单详情
 * 打印二维码
 * 导出pdf
 */

import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import { Button, Col, Row, Spin, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getCutterDataIndexs } from "store/modules/form";
import { errorMsg } from "store/modules/global";
import {
  createQRcode,
  historyOrderDetail,
  OrderItemsType,
  SubmitOrderType,
} from "store/modules/order";
import { getCutterNameFromMenus } from "utils/index";
import * as QRcode from "qrcode.react";
import { Buffer } from "buffer";
import styles from "./index.module.scss";
import orderDetailState from "./model";

const OrderDetail: FC = () => {
  const param = useParams<{ orderNo: string }>();
  const state = useSelector(orderDetailState);
  const [dataSource, setDataSource] = useState<SubmitOrderType>();
  const [loading, setLoading] = useState(true);
  const [qrCodeText, setQRcodeText] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  /**
   * 获取当前页面的信息数据
   */
  const getData = useCallback(async () => {
    const actions = await dispatch(historyOrderDetail(param.orderNo));
    if (isRejected(actions)) {
      dispatch(errorMsg(actions.error.message || "请求失败"));
      setLoading(false);
    }
    if (isFulfilled(actions)) {
      const payload = actions.payload as SubmitOrderType;
      const subCategoryList = payload.orders.map((item) => item.subCategory);
      await dispatch(getCutterDataIndexs(subCategoryList));
      setDataSource(payload);
      setLoading(false);
    }
  }, [dispatch, param.orderNo]);

  /**
   * 生成二维的文本内容
   */
  const QRcodeText = useCallback(async () => {
    const result = await dispatch(createQRcode(dataSource?.orders));
    if (isFulfilled(result)) {
      const text = result.payload as string;
      const textBase64 = Buffer.from(text, "utf8").toString("base64");
      setQRcodeText(textBase64);
    }
  }, [dataSource?.orders, dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    QRcodeText();
  }, [QRcodeText]);

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

  const goBack = () => {
    history.goBack();
  };

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
        scroll={{ x: true }}
        pagination={false}
      />
      <QRcode
        className={styles.QRCode}
        value={qrCodeText}
        renderAs="svg"
        width="auto"
        height="auto"
      />
      <Row justify="center" gutter={[16, 16]}>
        <Col xs={12} sm={6} md={5} lg={4}>
          <Button className={styles.btns} type="primary">
            打印
          </Button>
        </Col>
        <Col xs={12} sm={6} md={5} lg={4}>
          <Button className={styles.btns} type="ghost" onClick={goBack}>
            返回
          </Button>
        </Col>
        <Col span={24}>
          <Row justify="center" gutter={[16, 16]}>
            <Col xs={24} sm={12} md={10} lg={8}>
              <Button className={styles.btns} type="primary">
                导出pdf
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Spin>
  );
};

export default OrderDetail;
