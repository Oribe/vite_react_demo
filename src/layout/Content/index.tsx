import { Layout } from "antd";
import Transition from "component/Transition";
import React, { FC, useMemo } from "react";
import SwitchRouter from "route/Switch";
import { NavRouter } from "../../route";

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
    <Wrapper style={{ position: "relative" }}>
      <Transition pathnames={pathnames}>
        <SwitchRouter routers={routers} />
      </Transition>
    </Wrapper>
  );
};

export default Content;
interface Props {
  routers: NavRouter[];
}
