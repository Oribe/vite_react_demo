/**
 * 图片提示
 */

import React, { FC } from "react";
import { Popover } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const ImageHint: FC<Props> = (props) => {
  const { url, className } = props;
  return (
    <span className={className}>
      <Popover content={<img src={url} />}>
        <QuestionCircleOutlined />
      </Popover>
    </span>
  );
};

export default ImageHint;

interface Props {
  url: string;
  className?: string;
}
