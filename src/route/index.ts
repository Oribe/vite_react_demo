import { RouteProps } from "react-router-dom";
import Login from "../view/Login";
import Order from "/@view/Order";

export const router: RouteProps[] = [
  { path: "/login", component: Login },
  { path: "/", component: Order },
];
