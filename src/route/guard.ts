import { Dispatch } from "@reduxjs/toolkit";
import { History, LocationState } from "history";
import { match } from "react-router-dom";

export const routerAction: Record<RouterAction, RouterAction> = {
  beforeRouteEnter: "beforeRouteEnter",
  beforeMounted: "beforeMounted",
  beforeUnmounted: "beforeUnmounted",
  beforeRouteLeave: "beforeRouteLeave",
  beforeRouteUpdate: "beforeRouteUpdate",
};

export const routerInterceptors = new Map<RouterAction, Interceptor[]>();

class RouterGuard {
  /**
   * 页面进入前
   * 组件未加载
   */
  static beforeRouteEnter(interceptor: Interceptor) {
    const beforeInterceptors =
      routerInterceptors.get(routerAction.beforeRouteEnter) ?? [];
    routerInterceptors.set(routerAction.beforeRouteEnter, [
      ...beforeInterceptors,
      interceptor,
    ]);
  }

  /**
   * 页面加载前，
   * 页面已进入
   * 组件未装载
   */
  static beforeMounted(interceptor: Interceptor) {
    const beforeInterceptors =
      routerInterceptors.get(routerAction.beforeMounted) ?? [];
    routerInterceptors.set(routerAction.beforeMounted, [
      ...beforeInterceptors,
      interceptor,
    ]);
  }

  /**
   * 页面离开前
   * 页面已卸载
   */
  static beforeUnmounted(interceptor: Interceptor) {
    const leaveInterceptors =
      routerInterceptors.get(routerAction.beforeUnmounted) ?? [];
    routerInterceptors.set(routerAction.beforeUnmounted, [
      ...leaveInterceptors,
      interceptor,
    ]);
  }

  /**
   * 页面
   */
  static beforeRouteLeave(interceptor: Interceptor) {
    const leaveInterceptors =
      routerInterceptors.get(routerAction.beforeRouteLeave) ?? [];
    routerInterceptors.set(routerAction.beforeRouteLeave, [
      ...leaveInterceptors,
      interceptor,
    ]);
  }
}

export const {
  beforeRouteEnter,
  beforeMounted,
  beforeUnmounted,
  beforeRouteLeave,
} = RouterGuard;

export type RouterAction =
  | "beforeMounted"
  | "beforeUnmounted"
  | "beforeRouteUpdate"
  | "beforeRouteEnter"
  | "beforeRouteLeave";
export type Interceptor = (
  navigation: {
    history: History;
    from?: History;
  },
  dispatch: Dispatch
) => void;
