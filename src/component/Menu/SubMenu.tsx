import { Menu } from "antd";
import React, { CSSProperties, FC } from "react";
import { NavLink } from "react-router-dom";
import { ImageProps, NavRouter } from "route/index";
import styles from "./index.module.scss";

const { SubMenu: SubMenuComp, Item } = Menu;

export const MenuImage: FC<ImageProps> = (props) => {
  if (!props.src) {
    return null;
  }
  return (
    <div className={styles.menuImageWrapper}>
      <img {...props} />
    </div>
  );
};

export const MenuItem: FC<MenuItemProps> = ({
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
  if (Array.isArray(path)) {
    return null;
  }

  return (
    <Item className={className} style={style} icon={icon} key={path} {...props}>
      {path ? (
        <NavLink
          className={styles.navbarLink}
          activeStyle={activeStyle}
          activeClassName={activeClassName}
          strict
          to={path}
        >
          {image ? <MenuImage {...image} /> : null}
          {label ? <span className={styles.navbarLabel}>{label}</span> : null}
        </NavLink>
      ) : (
        <>
          {image ? <MenuImage {...image} /> : null}
          {label ? <span className={styles.navbarLabel}>{label}</span> : null}
        </>
      )}
    </Item>
  );
};

export const SubMenu: FC<Props> = ({
  menus,
  className,
  style,
  itemClassName,
  itemStyle,
  activeClassName,
  activeStyle,
  ...props
}) => {
  return (
    <>
      {menus.map((menu) => {
        const { path, label, icon, children } = menu;
        if (children) {
          return (
            <SubMenuComp
              className={className}
              style={style}
              key={label}
              icon={icon}
              title={label}
              {...props}
            >
              <SubMenu
                className={className}
                style={style}
                itemClassName={itemClassName}
                itemStyle={itemStyle}
                activeClassName={activeClassName}
                activeStyle={activeStyle}
                menus={children}
              />
            </SubMenuComp>
          );
        }
        return (
          <MenuItem
            className={itemClassName}
            style={itemStyle}
            activeClassName={activeClassName}
            activeStyle={activeStyle}
            key={label}
            {...props}
            {...menu}
          />
        );
      })}
    </>
  );
};

type Props = {
  menus: NavRouter[];
  style?: CSSProperties;
  className?: string;
  activeStyle?: CSSProperties;
  activeClassName?: string;
  itemClassName?: string;
  itemStyle?: CSSProperties;
};

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
