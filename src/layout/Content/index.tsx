import { Layout } from "antd";
import React, { FC } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { router } from "/@/route";

const Wrapper = Layout.Content;

const Content: FC<any> = () => {
  return (
    <Wrapper>
      <BrowserRouter>
        <Switch>
          {router.map((r, i) => (
            <Route
              key={i}
              path={r.path}
              component={r.component}
              exact={r.exact ?? true}
            />
          ))}
          <Redirect path="/" to="/login" />
        </Switch>
      </BrowserRouter>
    </Wrapper>
  );
};

export default Content;
