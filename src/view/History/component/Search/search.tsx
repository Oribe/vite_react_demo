import { Row, Col, DatePicker, Space, Button } from "antd";
import React, { FC } from "react";
import styles from "./index.module.scss";

const Search: FC<Props> = (props) => {
  const { onSearch } = props;
  return (
    <Row
      className={styles.searchContainer}
      justify="space-between"
      gutter={[24, 16]}
    >
      <Col className={styles.searchLeft} flex={1}>
        <Row align="middle">
          <label htmlFor="prevData">日期：</label>
          <DatePicker
            id="prevData"
            className={styles.datePicker}
            placeholder="开始日期"
          />
          <span className={styles.middleLink}>至</span>
          <DatePicker className={styles.datePicker} placeholder="结束日期" />
        </Row>
      </Col>
      <Col className={styles.btnsContainer}>
        <Row justify="center">
          <Space size="middle">
            <Button type="primary" onClick={onSearch}>
              查看
            </Button>
            <Button type="primary">续建订单</Button>
          </Space>
        </Row>
      </Col>
    </Row>
  );
};

export default Search;

interface Props {
  onSearch: (param: unknown) => void;
}
