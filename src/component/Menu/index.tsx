import { Menu } from "antd";
import { MenuMode } from "antd/lib/menu";
import { MenuInfo } from "rc-menu/lib/interface";
import React, { CSSProperties, FC, memo, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavRouter } from "route/index";
import MenuImage from "./MenuImage";
import MenuItem from "./MenuItem";
import { SubMenu } from "./SubMenu";

const { SubMenu: SubMenuComp } = Menu;

const Navbar: FC<Props> = (props) => {
  const [selectedKeys, setSelecteKeys] = useState<string[]>([]);
  const {
    menus,
    mode,
    className,
    style,
    itemClassName,
    itemStyle,
    subClassName,
    subStyle,
    activeClassName,
    activeStyle,
    subMenuClassName,
  } = props;

  if (!menus) {
    return null;
  }

  const handleMenuClick = (e: MenuInfo) => {
    console.log("点击", e.keyPath);
    setSelecteKeys(e.keyPath as string[]);
  };

  return (
    <Menu
      className={className}
      style={style}
      mode={mode ? mode : "horizontal"}
      selectedKeys={selectedKeys}
      onClick={handleMenuClick}
      triggerSubMenuAction="click"
    >
      {menus.map((menu) => {
        const { path, label, image, icon, children, isMenu } = menu;
        if (isMenu === false) return; // 非菜单
        if (children) {
          return (
            <SubMenuComp
              key={label}
              title={label}
              icon={
                <>
                  {icon ? { icon } : null}
                  <MenuImage {...image} />
                </>
              }
              className={subMenuClassName}
            >
              {children.map((child) => (
                <MenuItem
                  key={child.label}
                  path={child.path}
                  label={child.label}
                  image={child.image}
                  icon={child.icon}
                  className={itemClassName}
                  style={itemStyle}
                  activeClassName={activeClassName}
                  activeStyle={activeStyle}
                />
              ))}
            </SubMenuComp>
          );
        }
        return (
          <MenuItem
            key={label}
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

export default memo(Navbar);

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
  mode?: MenuMode;
  subMenuClassName?: string;
}
