import { Button, Col, DatePicker, Row, Space } from "antd";
import React, { FC, memo, useState } from "react";
import styles from "./index.module.scss";

const Search: FC<Props> = (props) => {
  const { onSearch, onChange, onRecreate } = props;
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();

  const onStartTimeChange = (_: unknown, dateString: string) => {
    setStartTime(dateString);
    if (onChange) {
      onChange({ startTime: dateString, endTime });
    }
  };

  const onEndTimeChange = (_: unknown, dateString: string) => {
    setEndTime(dateString);
    if (onChange) {
      onChange({ startTime, endTime: dateString });
    }
  };

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
            onChange={onStartTimeChange}
          />
          <span className={styles.middleLink}>至</span>
          <DatePicker
            className={styles.datePicker}
            placeholder="结束日期"
            onChange={onEndTimeChange}
          />
        </Row>
      </Col>
      <Col className={styles.btnsContainer}>
        <Row justify="center">
          <Space size="middle">
            <Button type="primary" onClick={onSearch}>
              查看
            </Button>
            <Button type="primary" onClick={onRecreate}>
              续建订单
            </Button>
          </Space>
        </Row>
      </Col>
    </Row>
  );
};

export default memo(Search);

interface Props {
  onSearch?: (param: unknown) => void;
  onChange?: (value: { startTime?: string; endTime?: string }) => void;
  onRecreate?: () => void;
}

export interface TimeRange {
  startTime?: string;
  endTime?: string;
}
