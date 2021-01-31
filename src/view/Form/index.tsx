import { Col, Row } from "antd";
import Form from "component/Form";
import Menu from "component/Menu";
import React, { FC, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createSelector } from "reselect";
import { NavRouter } from "route/index";
import { RootReducer } from "store/index";
import {
  FormMenu,
  FormState,
  FormSubMenu,
  getFormConfig,
  getFormMenu,
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
   * 菜单列表转换成router配置
   */
  const menuToRouter = useCallback((menus: (FormMenu | FormSubMenu)[]) => {
    return menus.reduce((routers, menu) => {
      const { name, imgUrl, subCategory } = menu;
      const router: NavRouter = {
        label: name,
        image: {
          src: imgUrl ? "http://localhost:3030" + imgUrl : "",
        },
      };
      if (Array.isArray(subCategory)) {
        /**
         * 存在子类
         */
        const children = menuToRouter(subCategory);
        router.children = children;
        routers.push(router);
        return routers;
      }
      /**
       * 不存在子类
       */
      router.path = "/order/add/" + subCategory;
      routers.push(router);

      return routers;
    }, [] as NavRouter[]);
  }, []);

  const menus = useMemo(() => {
    const menu = menuToRouter(state.menu);
    console.log(menu);
    return menu;
  }, [menuToRouter, state.menu]);

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.formTitle}>刀具选择与编辑</h3>
      <Row>
        <Col>
          <Menu
            mode="vertical"
            menus={menus}
            className={styles.formMenu}
            subMenuClassName={styles.formMenuSub}
            itemClassName={styles.formMenuItem}
          />
        </Col>
        <Col>
          <Form config={state.form[+params.subCategory]} />
        </Col>
      </Row>
    </div>
  );
};

export default CutterForm;

interface UrlParam {
  subCategory: string;
}
