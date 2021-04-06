import { Menu } from "antd";
import React, { CSSProperties, FC, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { ImageProps } from "route/index";
import MenuImage from "../MenuImage";
import styles from "./index.module.scss";

const { Item } = Menu;

const MenuItem: FC<MenuItemProps> = ({
  path,
  image,
  label,
  icon,
  className,
  style,
  activeClassName,
  activeStyle,
  ...props
}) => {
  const navbarLabel = useMemo(
    () => (label ? <span className={styles.navbarLabel}>{label}</span> : null),
    [label]
  );

  return (
    <Item
      className={`${className} ${styles.menuItem}`}
      style={style}
      icon={
        <>
          {icon ? { icon } : null}
          <MenuImage {...image} />
        </>
      }
      key={label}
      {...props}
    >
      {path ? (
        <NavLink
          className={styles.navbarLink}
          activeStyle={activeStyle}
          activeClassName={activeClassName}
          strict
          to={Array.isArray(path) ? path[0] : path}
        >
          {navbarLabel}
        </NavLink>
      ) : (
        { navbarLabel }
      )}
    </Item>
  );
};

export default MenuItem;

type MenuItemProps = {
  label?: string;
  icon?: React.ReactNode;
  image?: ImageProps;
  path?: string | string[];
  className?: string;
  style?: CSSProperties;
  activeStyle?: CSSProperties;
  activeClassName?: string;
};
