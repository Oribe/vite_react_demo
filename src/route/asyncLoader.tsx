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

const asyncLoader = <T extends ComponentType<any>>(
  loader: () => Promise<{ default: T }>
) => {
  const LazyComponent = (props: any) => {
    const history = useHistory();

    const Component = useMemo(() => lazy(loader), []);

    const handleRouterInterceptors = useCallback(
      (routerAction: RouterAction) => {
        const interceptors = routerInterceptors.get(routerAction) || [];
        for (let i = 0; i < interceptors?.length; i++) {
          interceptors[i](history);
        }
      },
      [history]
    );

    useEffect(() => {
      handleRouterInterceptors(routerAction.before);
      console.log("组件加载中");
      return () => {
        handleRouterInterceptors(routerAction.leave);
        console.log("组件卸载");
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
