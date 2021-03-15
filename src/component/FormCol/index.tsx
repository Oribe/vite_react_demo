import { Col, ColProps } from "antd";
import React, { FC } from "react";

const FormCol: FC<Props> = (props) => {
  const { children } = props;
  return (
    <Col xs={24} sm={12} {...props}>
      {children}
    </Col>
  );
};

export default FormCol;

type Props = ColProps & React.RefAttributes<HTMLDivElement>;
