import { Col, Row } from "antd";
import Form from "component/Form";
import Menu from "component/Menu";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
import { RootReducer } from "store/index";
import {
  FormState,
  getFormConfig,
  getFormMenu,
  searchOrderNumber,
} from "store/modules/Form";
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
  const handleSearch = async (orderNumber = "") => {
    const response = await dispatch(
      searchOrderNumber({ orderNumber, subCategory: +params.subCategory })
    );
    if (searchOrderNumber.fulfilled.match(response)) {
    }
  };

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.formTitle}>刀具选择与编辑</h3>
      <Row>
        <Col>
          <Menu
            mode="vertical"
            menus={state.menu}
            className={styles.formMenu}
            subMenuClassName={styles.formMenuSub}
            itemClassName={styles.formMenuItem}
            activeClassName={styles.activeClassName}
          />
        </Col>
        <Col>
          <Form
            config={state.form[+params.subCategory]}
            handleSearch={handleSearch}
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
