/**
 * 路由组件（复用）
 */

import * as H from "history";
import React, { FC, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Redirect,
  RedirectProps,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { NavRouter } from ".";
import { routerAction, RouterAction, routerInterceptors } from "./guard";

let from: H.History;
let to: H.History;

const SwitchRouter: FC<Props> = ({ location, routers, redirect }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleRouterInterceptors = useCallback(
    (routerActionType: RouterAction) => {
      const interceptors = routerInterceptors.get(routerActionType) ?? [];
      for (let i = 0; i < interceptors.length; i += 1) {
        interceptors[i]({ history, from }, dispatch);
      }
      to = { ...history };
    },
    [dispatch, history]
  );

  useEffect(() => {
    handleRouterInterceptors(routerAction.beforeRouteEnter);
    return () => {
      from = { ...to };
      handleRouterInterceptors(routerAction.beforeRouteLeave);
    };
  }, [handleRouterInterceptors]);

  return (
    <Switch location={location}>
      {routers.map(({ path, exact, component: Component }) => (
        <Route
          key={path?.toString()}
          path={path}
          exact={exact ?? true}
          render={(routeProps) => {
            return Component && <Component {...routeProps} />;
          }}
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
  location?: H.Location;
  routers: NavRouter[];
  redirect?: RedirectProps[];
}
