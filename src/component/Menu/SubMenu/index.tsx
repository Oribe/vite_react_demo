import { Menu } from "antd";
import React, { CSSProperties, FC } from "react";
import { NavRouter } from "route/index";
import MenuImage from "../MenuImage";
import MenuItem from "../MenuItem";

const { SubMenu: SubMenuComp } = Menu;

const SubMenu: FC<Props> = ({
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
        const { label, icon, image, routers } = menu;
        if (routers) {
          return (
            <SubMenuComp
              className={className}
              style={style}
              key={label}
              icon={
                <>
                  {icon ? { icon } : null}
                  <MenuImage {...image} />
                </>
              }
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
                menus={routers}
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

export default SubMenu;

type Props = {
  menus: NavRouter[];
  style?: CSSProperties;
  className?: string;
  activeStyle?: CSSProperties;
  activeClassName?: string;
  itemClassName?: string;
  itemStyle?: CSSProperties;
};
