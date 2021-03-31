import { History, LocationState } from "history";

export const routerAction: Record<RouterAction, RouterAction> = {
  before: "before",
  leave: "leave",
  update: "update",
};

export const routerInterceptors = new Map<RouterAction, Interceptor[]>();

class RouterGuard {
  /**
   * 路由跳转进入下一个页面前
   */
  static beforeEnter<T>(interceptor: Interceptor) {
    const beforeInterceptors =
      routerInterceptors.get(routerAction.before) ?? [];
    routerInterceptors.set("before", [...beforeInterceptors, interceptor]);
  }

  /**
   * 页面卸载离开
   */
  static beforeLeave(interceptor: Interceptor) {
    const leaveInterceptors = routerInterceptors.get(routerAction.leave) ?? [];
    routerInterceptors.set("leave", [...leaveInterceptors, interceptor]);
  }
}

export const beforeRouterEnter = RouterGuard.beforeEnter;
export const beforeRouterLeave = RouterGuard.beforeLeave;

export type RouterAction = "before" | "leave" | "update";
export type Interceptor = <T = LocationState>(history: History<T>) => void;
