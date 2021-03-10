/**
 * 收藏
 * URL： /tool/collection
 */

import { Button, Cascader, Col, Row, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import ButtonGroup, { ButtonTypes } from "component/ButtonGroup";
import React, { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { RootReducer } from "store/index";
import { CollectionType, CollectionState } from "store/modules/collection";

const collectionStore = createSelector<
  RootReducer,
  CollectionState,
  CollectionState
>(
  (store) => store.collection,
  (orderState) => orderState
);

const Collection: FC = () => {
  const collectionState = useSelector(collectionStore);
  /**
   * table行配置
   */
  const columns = useMemo<ColumnsType<CollectionType>>(
    () => [
      {
        title: "刀具子类",
        dataIndex: "subCategory",
        align: "center",
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
        render() {
          return <Button>导入</Button>;
        },
      },
    ],
    []
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

  return (
    <>
      <h3>刀具收藏列表</h3>
      <Row>
        <Col>
          <label htmlFor="">刀具子类：</label>
          <Cascader options={[]} />
        </Col>
        <Col>
          <Button>查看</Button>
        </Col>
      </Row>
      <Table
        columns={columns}
        rowSelection={rowSelection}
        rowKey="orderNumber"
        dataSource={collectionState.collectionList}
      />
      <ButtonGroup buttons={btns} />
    </>
  );
};

export default Collection;
