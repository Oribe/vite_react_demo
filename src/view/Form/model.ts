import { createSelector } from "@reduxjs/toolkit";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { NavRouter } from "route/index";
import { RootReducer } from "store/index";
import { FormState } from "store/modules/form";
import { OrderState } from "store/modules/order";

export const formProps = createSelector<RootReducer, FormState, FormState>(
  (states) => states.form,
  (formState) => formState
);

export const orderProps = createSelector<RootReducer, OrderState, OrderState>(
  (states) => states.order,
  (orderState) => orderState
);

/**
 * 动态生成菜单
 * 1. 新建菜单
 * 2. 未完成订单
 */
export const useCreateMenu = (baseRouters: NavRouter[]) => {
  const match = useRouteMatch();
  const [menu, setMenu] = useState<NavRouter[]>([]);

  const { url: matchPath } = match;

  const recreate = useCallback(
    (routerList: NavRouter[]) => {
      const routers = routerList.reduce<NavRouter[]>((all, current) => {
        const { routers: children, path } = current;
        const newRouter = { ...current };
        if (children) {
          const newChildren = recreate(children);
          newRouter.routers = newChildren;
          all.push(newRouter);
          return all;
        }
        if (path) {
          if (typeof path === "string") {
            newRouter.path = matchPath.replace(/\/(\d)*$/, path ?? "");
          } else {
            newRouter.path = matchPath.replace(/\/(\d)*$/, path[0] ?? "");
          }
        }
        all.push(newRouter);
        return all;
      }, []);
      return routers;
    },
    [matchPath]
  );

  useEffect(() => {
    const newRouter = recreate(baseRouters);
    setMenu(newRouter);
  }, [baseRouters, recreate]);

  return menu;
};

export const useListUrl = () => {
  const history = useHistory();
  const params = useParams<{ orderNo: string }>();
  const [listUrl, setListUrl] = useState<string>();

  useEffect(() => {
    if (history.location.pathname.includes("order")) {
      setListUrl("/order");
    }
    if (history.location.pathname.includes("uncompleted")) {
      const { orderNo } = params;
      setListUrl(`/uncompleted/${orderNo ?? ""}`);
    }
  }, [history.location.pathname, params]);

  return listUrl;
};
