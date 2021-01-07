import { RouteProps } from "react-router-dom";
import asyncLoader from "./asyncLoader";

export const basename = "/tool";

export const router: RouteProps[] = [
  {
    path: "/",
    component: asyncLoader(() => import("view/Order")),
    exact: true,
  },
  {
    path: "/login",
    component: asyncLoader(() => import("view/Login")),
    exact: true,
  },
  {
    path: "/user",
    component: asyncLoader(() => import("view/User")),
    exact: true,
  },
];

export { beforeRouterEnter, beforeRouterLeave } from "./guard";

export const navRouter: NavRouter[] = [
  {
    label: "新建订单",
    path: "/order",
    component: asyncLoader(() => import("view/Order")),
  },
  {
    label: "未完成订单",
    path: "/uncompleted",
    component: asyncLoader(() => import("view/Uncompleted")),
  },
  {
    label: "历史订单",
    path: "/history",
    component: asyncLoader(() => import("view/History")),
  },
  {
    label: "收藏",
    path: "/collection",
    component: asyncLoader(() => import("view/Collection")),
  },
];

export interface NavRouter extends RouteProps {
  label?: string;
  icon?: React.ReactNode;
  image?: {
    url: string;
    alt?: string;
  };
  children?: NavRouter[];
}
