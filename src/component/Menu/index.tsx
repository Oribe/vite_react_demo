import { Menu } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import React, { CSSProperties, FC } from "react";
import { useLocation } from "react-router-dom";
import { NavRouter } from "route/index";
import { MenuItem, SubMenu } from "./SubMenu";

const Navbar: FC<Props> = (props) => {
  const location = useLocation();
  const {
    menus,
    className,
    style,
    itemClassName,
    itemStyle,
    subClassName,
    subStyle,
    activeClassName,
    activeStyle,
  } = props;

  if (!menus) {
    return null;
  }

  const handleMenuClick = (e: MenuInfo) => {
    console.log("点击", e.key);
  };

  return (
    <Menu
      className={className}
      style={style}
      mode="horizontal"
      selectedKeys={[location.pathname]}
      onClick={handleMenuClick}
    >
      {menus.map((menu) => {
        const { path, label, image, icon, children } = menu;
        if (children) {
          return (
            <SubMenu
              key={path}
              menus={children}
              className={subClassName}
              style={subStyle}
              itemClassName={itemClassName}
              itemStyle={itemStyle}
              activeClassName={activeClassName}
              activeStyle={activeStyle}
            />
          );
        }
        return (
          <MenuItem
            key={path}
            path={path}
            label={label}
            image={image}
            icon={icon}
            className={itemClassName}
            style={itemStyle}
            activeClassName={activeClassName}
            activeStyle={activeStyle}
          />
        );
      })}
    </Menu>
  );
};

export default Navbar;

interface Props {
  menus: NavRouter[];
  className?: string;
  style?: CSSProperties;
  itemClassName?: string;
  itemStyle?: CSSProperties;
  subClassName?: string;
  subStyle?: CSSProperties;
  activeStyle?: CSSProperties;
  activeClassName?: string;
}
