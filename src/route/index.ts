import { RedirectProps, RouteProps } from "react-router-dom";
import asyncLoader from "./asyncLoader";

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
    path: ["/:model", "/:model/add/:subCategory"],
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
  {
    path: "/order/add/:subCategory",
    component: asyncLoader(() => import("view/Form")),
    isMenu: false,
  },
];

export interface NavRouter extends RouteProps {
  label?: string;
  icon?: React.ReactNode;
  image?: ImageProps;
  children?: NavRouter[];
  path?: string | string[];
  transition?: string;
  isMenu?: boolean;
}

export type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;
