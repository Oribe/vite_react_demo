import { Layout } from "antd";
import React, { FC, useMemo } from "react";
import SwitchRouter from "route/Switch";
import { NavRouter, redirctRouter } from "../../route";
import style from "./index.module.scss";

const Wrapper = Layout.Content;

const Content: FC<Props> = ({ routers }) => {
  const pathnames = useMemo(() => {
    return routers.reduce((paths, current) => {
      const { path } = current;
      if (!path) {
        return paths;
      }
      if (Array.isArray(path)) {
        paths.concat(path);
      }
      if (typeof path === "string" || typeof path === "number") {
        paths.push(path);
      }
      return paths;
    }, [] as (string | number)[]);
  }, [routers]);

  console.log(pathnames);

  return (
    <Wrapper className={style.main} style={{ position: "relative" }}>
      <div className={style.content}>
        <SwitchRouter routers={routers} redirect={redirctRouter} />
      </div>
    </Wrapper>
  );
};

export default Content;
interface Props {
  routers: NavRouter[];
}
