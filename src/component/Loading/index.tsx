/**
 * loading
 */

import { Row, Spin, SpinProps } from "antd";
import React, { FC } from "react";

const Loading: FC<Props> = (props) => {
  return (
    <Row justify="center" style={{ marginTop: 20 }}>
      <Spin {...props} />
    </Row>
  );
};

export default Loading;

type Props = SpinProps;
