import { Menu } from "antd";
import React from "react";
import { FC } from "react";
import { useLocation } from "react-router-dom";
import { NavRouter } from "route/index";
import SubMenuComp from "./SubMenu";

const Navbar: FC<Props> = (props) => {
  const location = useLocation();
  const { menus } = props;

  if (!menus) {
    return null;
  }

  return (
    <Menu
      // style={{ width: 256 }}
      selectedKeys={[location.pathname]}
      mode="horizontal"
    >
      <SubMenuComp menus={menus} />
    </Menu>
  );
};

export default Navbar;

interface Props {
  menus: NavRouter[];
}
