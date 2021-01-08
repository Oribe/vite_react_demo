import { Menu } from "antd";
import { cloneDeep } from "lodash-es";
import React, { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import { ImageProps, NavRouter } from "route/index";
import style from "./index.module.scss";

const { SubMenu, Item } = Menu;

const MenuImage: FC<ImageProps> = (props) => {
  if (!props.src) {
    return null;
  }
  return (
    <div className={style.menuImageWrapper}>
      <img {...props} />
    </div>
  );
};

const MenuItem: FC<MenuItemProps> = (props) => {
  const { path, image, label } = props;

  const itemContent = useMemo(() => {
    console.log(path);
    return path ? (
      <Link to={path}>
        {image ? <MenuImage {...image} /> : null}
        {label ? <span className={style.menuLableContent}>{label}</span> : null}
      </Link>
    ) : (
      <>
        {image ? <MenuImage {...image} /> : null}
        {label ? <span className={style.menuLableContent}>{label}</span> : null}
      </>
    );
  }, [image, label, path]);

  const itemProps = useMemo(() => {
    const pr = cloneDeep(props);
    delete pr.path;
    delete pr.image;
    delete pr.label;
    return pr;
  }, [props]);

  return (
    <Item {...itemProps}>
      {path ? (
        <Link to={path}>
          {image ? <MenuImage {...image} /> : null}
          {label ? (
            <span className={style.menuLableContent}>{label}</span>
          ) : null}
        </Link>
      ) : (
        <>
          {image ? <MenuImage {...image} /> : null}
          {label ? (
            <span className={style.menuLableContent}>{label}</span>
          ) : null}
        </>
      )}
    </Item>
  );
};

const SubMenuComp: FC<Props> = (props) => {
  const { menus } = props;
  return (
    <>
      {menus.map((menu) => {
        const { path, label, icon, children } = menu;
        if (children) {
          return (
            <SubMenu key={path as string} icon={icon} title={label} {...props}>
              <SubMenuComp menus={children} />
            </SubMenu>
          );
        }
        return <MenuItem key={label} {...props} {...menu} />;
      })}
    </>
  );
};

export default SubMenuComp;

type Props = {
  menus: NavRouter[];
};

type MenuItemProps = {
  label?: string;
  icon?: React.ReactNode;
  image?: ImageProps;
  path?: string;
};
