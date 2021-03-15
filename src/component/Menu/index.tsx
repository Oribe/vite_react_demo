import { Menu } from "antd";
import { MenuMode } from "antd/lib/menu";
import React, {
  CSSProperties,
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { NavRouter } from "route/index";
import styles from "./index.module.scss";
import MenuImage from "./MenuImage";
import MenuItem from "./MenuItem";

const { SubMenu: SubMenuComp } = Menu;

const Navbar: FC<Props> = (props) => {
  const location = useLocation();
  const [selectedKeys, setSelecteKeys] = useState<string[]>([]);
  const {
    menus,
    mode,
    className,
    style,
    itemClassName,
    itemStyle,
    activeClassName,
    activeStyle,
    subMenuClassName,
  } = props;

  /**
   * 当页面刷新时，匹配当前菜单key
   */
  const matchRouterKey = useCallback(
    (menuList: NavRouter[]) => {
      return menuList.reduce((keyList, menu) => {
        let newKeyList = keyList;
        const { label, path, routers } = menu;
        if (Array.isArray(path)) return keyList;
        if (routers) {
          const childrenKeyList = matchRouterKey(routers);
          if (childrenKeyList.length > 0) {
            /**
             * 子类中有匹配
             */
            newKeyList = [...childrenKeyList, path ?? label ?? "", ...keyList];
          }
        } else if (
          typeof path === "string" &&
          location.pathname.includes(path)
        ) {
          /**
           * 无子类
           */
          newKeyList.push(path ?? label ?? "");
        }
        return newKeyList;
      }, [] as string[]);
    },
    [location.pathname]
  );

  useEffect(() => {
    const keys = matchRouterKey(menus);
    setSelecteKeys(keys);
  }, [matchRouterKey, menus]);

  if (!menus) {
    return null;
  }

  return (
    <Menu
      className={`${className} ${styles.antdMenu}`}
      style={style}
      mode={mode || "horizontal"}
      selectedKeys={selectedKeys}
      triggerSubMenuAction="click"
    >
      {menus.map((menu) => {
        const { path, label, image, icon, routers, isMenu } = menu;
        if (isMenu === false) return null; // 非菜单
        if (Array.isArray(path)) return null;
        if (routers) {
          return (
            <SubMenuComp
              key={path ?? label}
              title={label}
              icon={
                <>
                  {icon ? { icon } : null}
                  <MenuImage {...image} />
                </>
              }
              className={`${subMenuClassName} ${
                selectedKeys.includes(path ?? label ?? "") ? styles.active : ""
              }`}
            >
              {routers.map((child) => {
                if (Array.isArray(child.path)) return null;
                return (
                  <MenuItem
                    key={child.path}
                    path={child.path}
                    label={child.label}
                    image={child.image}
                    icon={child.icon}
                    className={itemClassName}
                    style={itemStyle}
                    activeClassName={activeClassName}
                    activeStyle={activeStyle}
                  />
                );
              })}
            </SubMenuComp>
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
