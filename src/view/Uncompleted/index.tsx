/**
 * 未完成订单
 */
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { TableRowSelection } from "antd/lib/table/interface";
import Search from "component/Search";
import React, { FC, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUncompletedOrders, TimeRangeParam } from "store/modules/order";
import uncompletedState from "./model";

const Uncompleted: FC = () => {
  const [condition, setCondition] = useState<TimeRangeParam>({});

  const state = useSelector(uncompletedState);
  const dispatch = useDispatch();

  const columns = useMemo<ColumnsType<any>>(() => {
    return [
      {
        title: "订单流水号",
        dataIndex: "orderNo",
        align: "center",
      },
      {
        title: "型号数量",
        dataIndex: "modelNumber",
        align: "center",
      },
      {
        title: "订单总数",
        dataIndex: "quantity",
        align: "center",
      },
      {
        title: "保存日期",
        dataIndex: "createAt",
        align: "center",
      },
      {
        title: "操作",
        dataIndex: "action",
        render() {
          return <Link to="/">操作</Link>;
        },
      },
    ];
  }, []);
  const rowSelection = useMemo<TableRowSelection<any>>(() => {
    return {
      type: "checkbox",
    };
  }, []);

  const onChange = useCallback((value) => {
    setCondition((prev) => ({ ...prev, ...value }));
  }, []);

  const onSearch = useCallback(() => {
    dispatch(getUncompletedOrders(condition));
  }, [condition, dispatch]);

  return (
    <>
      <Search onSearch={onSearch} onChange={onChange} />
      <Table
        columns={columns}
        rowSelection={rowSelection}
        loading={state.loading}
        dataSource={state.data}
      />
    </>
  );
};

export default Uncompleted;
