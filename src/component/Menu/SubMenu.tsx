import { NavRouter } from "route/index";

import { Menu } from "antd";
import React, { FC } from "react";
import style from "index.module.scss";

const { SubMenu, Item } = Menu;

const MenuImage: FC<{ url: string; alt?: string }> = ({ url, alt }) => {
  return (
    <div className={style.menuImageWrapper}>
      <img src={url} alt={alt} />
    </div>
  );
};

const SubMenuComp: FC<Props> = (props) => {
  const { menus } = props;
  return (
    <SubMenu>
      {menus.map((m) => {
        const { label, children, icon, image } = m;
        if (children) {
          return <SubMenuComp menus={children} />;
        }
        return (
          <Item icon={icon} key={label}>
            {image ? <MenuImage url={image.url} alt={image.alt} /> : null}
            <span className={style.menuLableContent}>{label}</span>
          </Item>
        );
      })}
    </SubMenu>
  );
};

export default SubMenuComp;

interface Props {
  menus: NavRouter[];
}
