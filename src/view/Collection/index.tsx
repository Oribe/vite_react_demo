/**
 * 收藏
 * URL： /tool/collection
 */

import { Button, Cascader, Col, Row, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import ButtonGroup, { ButtonTypes } from "component/ButtonGroup";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  collectionSearch,
  CollectionType,
  importCollectionToOrderList,
} from "store/modules/collection";
import { getFormMenu } from "store/modules/form";
import { collectionStore } from "./model";
import styles from "./index.module.scss";

const Collection: FC = () => {
  const dispatch = useDispatch();
  const state = useSelector(collectionStore);
  const [subCategory, setSubCategory] = useState<number>();
  /**
   * 导入
   */
  const handleImportToOrderList = useCallback(
    (improtList: number[]) => {
      dispatch(importCollectionToOrderList(improtList));
    },
    [dispatch]
  );

  /**
   * table行配置
   */
  const columns = useMemo<ColumnsType<CollectionType>>(
    () => [
      {
        title: "刀具子类",
        dataIndex: "subCategory",
        align: "center",
        render(value, record) {
          const categoryOption = state.cutterCategory.find(
            (item) => item.value === record.category
          );
          const subCategoryOption = categoryOption?.children?.find(
            (item) => item.value === value
          );
          return subCategoryOption?.label ?? value;
        },
      },
      {
        title: "制造商",
        dataIndex: "manufacturer",
        align: "center",
      },
      {
        title: "操作",
        key: "action",
        align: "center",
        render(_, record) {
          return (
            <Button
              type="link"
              onClick={() => {
                handleImportToOrderList([record.id]);
              }}
            >
              导入
            </Button>
          );
        },
      },
    ],
    [handleImportToOrderList, state.cutterCategory]
  );

  /**
   * table行选择
   */
  const rowSelection = useMemo<TableRowSelection<unknown>>(
    () => ({
      type: "checkbox",
      onChange: () => {
        //
      },
    }),
    []
  );

  /**
   * 按钮组
   */
  const btns = useMemo<ButtonTypes[]>(
    () => [
      {
        label: "删除",
      },
      {
        label: "导入",
      },
    ],
    []
  );

  useEffect(() => {
    /**
     * 获取下拉菜单数据
     */
    dispatch(getFormMenu());
  }, [dispatch]);

  /**
   * 搜索
   */
  const handelSearch = () => {
    dispatch(collectionSearch(subCategory));
  };

  return (
    <>
      <h3>刀具收藏列表</h3>
      <Row className={styles.searchRow}>
        <Col span={18} className={styles.searchOptionsCol}>
          <label htmlFor="subCategory" className={styles.searchTitle}>
            刀具子类：
          </label>
          <Cascader
            id="subCategory"
            className={styles.searchOptions}
            options={state.cutterCategory}
            onChange={([, subCategory]) => {
              if (subCategory) {
                setSubCategory(+subCategory);
                return;
              }
              setSubCategory(undefined);
            }}
          />
        </Col>
        <Col span={6}>
          <Row justify="end">
            <Button type="primary" onClick={handelSearch}>
              查看
            </Button>
          </Row>
        </Col>
      </Row>
      <Table
        columns={columns}
        rowSelection={rowSelection}
        rowKey="orderNumber"
        loading={state.collectionList.loading}
        dataSource={state.collectionList.data}
      />
      <div className={styles.btnsContainer}>
        <ButtonGroup buttons={btns} />
      </div>
    </>
  );
};

export default Collection;
