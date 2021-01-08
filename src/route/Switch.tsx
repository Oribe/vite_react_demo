import React, { FC } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { NavRouter } from ".";

const SwitchRouter: FC<Props> = (props) => {
  const location = useLocation();

  return (
    <Switch location={location}>
      {props.routers.map((r) => (
        <Route
          key={r.path as string}
          path={r.path}
          exact={r.exact ?? true}
          component={r.component}
        />
      ))}
      {/* <Redirect to="/" /> */}
    </Switch>
  );
};

export default SwitchRouter;

interface Props {
  routers: NavRouter[];
}
