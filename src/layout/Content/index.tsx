import { Layout } from "antd";
import React, { FC } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { router } from "../../route";

const Wrapper = Layout.Content;

const Content: FC = () => {
  return (
    <Wrapper>
      <Switch>
        {router.map((r, i) => (
          <Route
            key={i}
            path={r.path}
            component={r.component}
            exact={r.exact ?? true}
          />
        ))}
        <Redirect to="/" />
      </Switch>
    </Wrapper>
  );
};

export default Content;
