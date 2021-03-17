import Loading from "component/Loading";
import React, {
  ComponentType,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useHistory } from "react-router-dom";
import { routerAction, RouterAction, routerInterceptors } from "./guard";

const asyncLoader = <T extends ComponentType<unknown>>(
  loader: () => Promise<{ default: T }>
) => {
  const LazyComponent = (props: any) => {
    const history = useHistory();
    /**
     * 加载组件
     */
    const Component = useMemo(() => lazy(loader), []);

    /**
     * 路由拦截拦截
     */
    const handleRouterInterceptors = useCallback(
      (routerActionType: RouterAction) => {
        const interceptors = routerInterceptors.get(routerActionType) || [];
        for (let i = 0; i < interceptors?.length; i += 1) {
          interceptors[i](history);
        }
      },
      [history]
    );

    useEffect(() => {
      handleRouterInterceptors(routerAction.before);
      // console.log("组件加载中");
      return () => {
        handleRouterInterceptors(routerAction.leave);
        // console.log("组件卸载");
      };
    }, [handleRouterInterceptors]);

    return (
      <Suspense fallback={<Loading tip="loading..." />}>
        <Component {...props} />
      </Suspense>
    );
  };
  return LazyComponent;
};

export default asyncLoader;
