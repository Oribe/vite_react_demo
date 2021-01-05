import { RouteProps } from "react-router-dom";
import asyncLoader from "./asyncLoader";

export const basename = "/tool";

export const router: RouteProps[] = [
  { path: "/", component: asyncLoader(() => import("view/Order")) },
  { path: "/login", component: asyncLoader(() => import("view/Login")) },
  { path: "/user", component: asyncLoader(() => import("view/User")) },
];

export { beforeRouterEnter, beforeRouterLeave } from "./guard";
