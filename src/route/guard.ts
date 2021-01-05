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
  beforeEnter(interceptor: any) {
    const beforeInterceptors =
      routerInterceptors.get(routerAction.before) ?? [];
    routerInterceptors.set("before", [...beforeInterceptors, interceptor]);
    return;
  }

  /**
   * 页面卸载离开
   */
  beforeLeave(interceptor: any) {
    const leaveInterceptors = routerInterceptors.get(routerAction.leave) ?? [];
    routerInterceptors.set("leave", [...leaveInterceptors, interceptor]);
    return;
  }
}

const routerGuard = new RouterGuard();

export const beforeRouterEnter = routerGuard.beforeEnter;
export const beforeRouterLeave = routerGuard.beforeLeave;

export type RouterAction = "before" | "leave" | "update";
export type Interceptor = (history: History<LocationState>) => void;
