import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";
import React from "react";
import { FC } from "react";
import { debounce } from "lodash-es";
import ButtonGroup, { ButtonGroupProps } from "antd/lib/button/button-group";
import style from "./index.module.scss";

const ButtonGroups: FC<Props> = ({
  config: { className, ...arg } = {},
  buttons,
}) => {
  return (
    <ButtonGroup className={`${style.buttonGroup} ${className}`} {...arg}>
      {buttons.map(({ label, onClick, className, ...props }) => {
        return (
          <Button
            className={`${style.but} ${className}`}
            key={label}
            onClick={debounce((...arg: any) => {
              onClick && onClick(arg);
            }, 500)}
            {...props}
          >
            {label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export default ButtonGroups;

export type ButtonTypes = { label: string } & ButtonProps &
  React.RefAttributes<HTMLElement>;

interface Props {
  config?: ButtonGroupProps;
  buttons: ButtonTypes[];
}
