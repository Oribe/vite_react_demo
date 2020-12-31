import { lazy } from "react";
import { RouteProps } from "react-router-dom";
import Login from "../view/Login";

export const router: RouteProps[] = [{ path: "/login", component: Login }];
