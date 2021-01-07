import { Layout } from "antd";
import Transition from "component/Transition";
import React, { FC } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { router } from "../../route";

const Wrapper = Layout.Content;

const Content: FC = () => {
  const location = useLocation();

  return (
    <Wrapper style={{ position: "relative" }}>
      <Transition>
        <Switch location={location}>
          {router.map((r) => (
            <Route
              key={r.path as string}
              path={r.path}
              exact={r.exact ?? true}
              component={r.component}
            />
          ))}
          <Redirect to="/" />
        </Switch>
      </Transition>
    </Wrapper>
  );
};

export default Content;
