import { isFulfilled, isRejected } from "@reduxjs/toolkit";
import { Col, message, Row } from "antd";
import Form from "component/Form";
import Menu from "component/Menu";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
import { RootReducer } from "store/index";
import { FormState, getFormConfig, getFormMenu } from "store/modules/form";
import {
  addToOrderList,
  collection,
  Cutter,
  searchOrderNumber,
} from "store/modules/order";
import styles from "./index.module.scss";

const formProps = createSelector<RootReducer, FormState, FormState>(
  (states) => states.form,
  (formState) => formState
);

const CutterForm: FC = () => {
  const state = useSelector(formProps);
  const dispatch = useDispatch();
  const params = useParams<UrlParam>();

  /**
   * api请求获取数据
   */
  useEffect(() => {
    dispatch(getFormMenu());
  }, [dispatch]);

  /**
   * 获取form配置
   */
  useEffect(() => {
    if (+params.subCategory > 0) {
      dispatch(getFormConfig(+params.subCategory));
    }
  }, [dispatch, params]);

  /**
   * 订货号搜索
   */
  const onSearchOrderNumber = async (orderNumber = "") => {
    const response = await dispatch(
      searchOrderNumber({ orderNumber, subCategory: +params.subCategory })
    );
    if (isFulfilled(response)) {
      const resData = response.payload as Cutter[];
      const cutterOptions = resData.map((item) => ({
        label: item.orderNumber,
        value: JSON.stringify(item),
      }));
      return Promise.resolve(cutterOptions);
    }
    return Promise.resolve([]);
  };

  /**
   *  收藏
   * @param order
   */
  const onCollection = (cutter: Cutter) => {
    dispatch(collection([{ ...cutter, subCategory: +params.subCategory }]));
  };

  /**
   * 添加到订单列表
   */
  const onAdd = async (order: Cutter) => {
    const result = await dispatch(
      addToOrderList({ ...order, subCategory: +params.subCategory })
    ); // 可以成功运行，且能通过ts校验
    if (isFulfilled(result)) {
      message.success("添加成功");
    }
    if (isRejected(result)) {
      message.error("添加失败");
      return Promise.reject();
    }
    return Promise.resolve(true);
  };

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.formTitle}>刀具选择与编辑</h3>
      <Row wrap={false}>
        <Col xs={0} md={6}>
          <Menu
            mode="vertical"
            menus={state.routers}
            className={styles.formMenu}
            subMenuClassName={styles.formMenuSub}
            itemClassName={styles.formMenuItem}
            activeClassName={styles.activeClassName}
          />
        </Col>
        <Col xs={24} md={18} className={styles.fromWrapper}>
          <Form
            config={state.form.data[+params.subCategory]}
            onAdd={onAdd}
            loading={state.form.loading}
            onCollection={onCollection}
            onSearchOrderNumber={onSearchOrderNumber}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CutterForm;

interface UrlParam {
  subCategory: string;
}
