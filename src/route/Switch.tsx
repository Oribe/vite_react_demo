import * as H from "history";
import React, { FC } from "react";
import { Redirect, RedirectProps, Route, Switch } from "react-router-dom";
import { NavRouter } from ".";

const SwitchRouter: FC<Props> = ({ location, routers, redirect }) => {
  return (
    <Switch location={location}>
      {routers.map((r) => (
        <Route
          key={r.path as string}
          path={r.path}
          exact={r.exact ?? true}
          component={r.component}
        />
      ))}
      {redirect?.map((r) => (
        <Redirect
          key={r.path}
          path={r.path}
          to={r.to}
          exact={r.exact ?? true}
        />
      ))}
    </Switch>
  );
};

export default SwitchRouter;

interface Props {
  location: H.Location;
  routers: NavRouter[];
  redirect?: RedirectProps[];
}
