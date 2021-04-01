import { ImgHTMLAttributes } from "react";
import { RedirectProps, RouteProps } from "react-router-dom";
import asyncLoader from "./asyncLoader";
import {
  beforeMounted,
  beforeRouteEnter,
  beforeRouteLeave,
  beforeUnmounted,
} from "./guard";

export const basename = "/tool";

/**
 * 主路由
 */
export const router: NavRouter[] = [
  {
    path: "/login",
    component: asyncLoader(() => import("view/Login")),
    exact: true,
    transition: "top",
  },
  {
    path: "/user",
    component: asyncLoader(() => import("view/User")),
    exact: true,
  },
  {
    path: [
      "/:model",
      "/:model/add/:subCategory",
      "/:model/edit/:subCategory",
      "/:model/:orderNo",
    ],
    component: asyncLoader(() => import("view/Navigation")),
    exact: true,
  },
];

/**
 * 动画黑名单
 * 添加后当切换到匹配的路由时将不会产生过度动画
 */
export const animateBlackList = [/\/(\w)+\/add\/(\d)+/];

/**
 * 重定向
 */
export const redirctRouter: RedirectProps[] = [
  {
    path: "/",
    to: "/order",
  },
];

export { beforeMounted, beforeRouteEnter, beforeRouteLeave, beforeUnmounted };

export const navRouter: NavRouter[] = [
  {
    label: "新建订单",
    path: ["/order", "/uncompleted/:orderNo"],
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
  {
    label: "表单",
    path: [
      "/order/add/:subCategory",
      "/order/edit/:subCategory",
      "/uncompleted/add/:subCategory",
      "/uncompleted/edit/:subCategory",
    ],
    component: asyncLoader(() => import("view/Form")),
    isMenu: false,
  },
  {
    label: "二维码",
    path: ["/order/:orderNo", "/history/:orderNo"],
    component: asyncLoader(() => import("view/OrderDetail")),
    isMenu: false,
  },
];

beforeRouteEnter(({ history, from }, dispatch) => {
  if (
    history.location.pathname.includes("/uncompleted/") &&
    from &&
    !from.location.pathname.includes("/uncompleted/")
  ) {
    // 进入前缓存
    dispatch({ type: "order/saveOrderListToCache" });
  }
});

beforeRouteLeave(({ history, from }, dispatch) => {
  if (
    from &&
    from.location.pathname.includes("/uncompleted/") &&
    !history.location.pathname.includes("/uncompleted/")
  ) {
    // 离开后取出缓存
    dispatch({ type: "order/getOrderListFromCache" });
  }
});

export type NavRouter = {
  label?: string;
  icon?: React.ReactNode;
  image?: ImgHTMLAttributes<unknown>;
  path?: string | string[];
  transition?: string;
  isMenu?: boolean;
  routers?: NavRouter[];
} & RouteProps;

export type ImageProps = ImgHTMLAttributes<unknown>;
