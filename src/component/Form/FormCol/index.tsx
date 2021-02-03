import { Col, ColProps } from "antd";
import React from "react";
import { FC } from "react";

const FormCol: FC<Props> = (props) => {
  return (
    <Col xs={24} sm={12} {...props}>
      {props.children}
    </Col>
  );
};

export default FormCol;

type Props = ColProps & React.RefAttributes<HTMLDivElement>;
