import Navbar from "component/Menu";
import Transition from "component/Transition";
import React, { FC } from "react";
import { useLocation } from "react-router-dom";
import { navRouter } from "route/index";
import SwitchRouter from "route/Switch";
import style from "./index.module.scss";

const Navigation: FC = () => {
  const location = useLocation();
  return (
    <>
      <Navbar
        className={style.navbar}
        menus={navRouter}
        itemClassName={style.menuItem}
        activeClassName={style.navbarActive}
      />
      <Transition location={location}>
        <SwitchRouter location={location} routers={navRouter} />
      </Transition>
    </>
  );
};

export default Navigation;
