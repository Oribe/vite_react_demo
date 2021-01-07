import { Menu } from "antd";
import React from "react";
import { FC } from "react";
import { NavRouter } from "route/index";
import SubMenuComp from "./SubMenu";

const Navbar: FC<Props> = (props) => {
  const { menus } = props;

  if (!menus) {
    return null;
  }

  return (
    <Menu>
      <SubMenuComp menus={menus} />
    </Menu>
  );
};

export default Navbar;

interface Props {
  menus: NavRouter[];
}
