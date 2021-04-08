/** *
 * 按钮组
 */

import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";
import React, { FC } from "react";
import { debounce } from "lodash-es";
import ButtonGroup, { ButtonGroupProps } from "antd/lib/button/button-group";
import { Link } from "react-router-dom";
import style from "./index.module.scss";

const ButtonGroups: FC<Props> = ({
  config: { className, ...arg } = {},
  buttons,
}) => {
  return (
    <ButtonGroup className={`${style.buttonGroup} ${className}`} {...arg}>
      {buttons.map(
        ({ label, onClick, className: classname, href, ...props }) => {
          return (
            <Button
              className={`${style.but} ${classname}`}
              key={label}
              onClick={debounce((...args) => {
                if (onClick) {
                  onClick(args);
                }
              }, 500)}
              {...props}
            >
              {href ? (
                <Link to={href} className={style.link}>
                  {label}
                </Link>
              ) : (
                label
              )}
            </Button>
          );
        }
      )}
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
