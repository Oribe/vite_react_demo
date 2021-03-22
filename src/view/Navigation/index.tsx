import Navbar from "component/Menu";
import Transition from "component/Transition";
import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { navRouter } from "route/index";
import SwitchRouter from "route/Switch";
import { getFormMenu } from "store/modules/form";
import style from "./index.module.scss";

const Navigation: FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFormMenu());
  }, [dispatch]);

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
