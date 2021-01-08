import Navbar from "component/Menu";
import Transition from "component/Transition";
import React, { FC, useMemo } from "react";
import { navRouter } from "route/index";
import SwitchRouter from "route/Switch";

const Navigation: FC = () => {
  const pathnames = useMemo(() => {
    return navRouter.reduce((paths, current) => {
      const { path } = current;
      if (path) {
        if (typeof path === "string" && typeof path === "number") {
          paths.push(path);
        }
        if (Array.isArray(path)) {
          paths.concat(path);
        }
      }
      return paths;
    }, [] as (string | number)[]);
  }, []);

  return (
    <>
      <Navbar menus={navRouter} />
      <section>
        <Transition pathnames={pathnames}>
          <SwitchRouter routers={navRouter} />
        </Transition>
      </section>
    </>
  );
};

export default Navigation;
