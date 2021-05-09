import Loading from "component/Loading";
import React, {
  FC,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { routerAction, RouterAction, routerInterceptors } from "./guard";

export default function asyncLoader(loader: () => Promise<{ default: any }>) {
  const LazyComponent: FC = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    /**
     * 加载组件
     */
    const Component = useMemo(() => lazy(loader), []);
    /**
     * 路由拦截拦截
     */
    const handleRouterInterceptors = useCallback(
      async (routerActionType: RouterAction) => {
        const interceptors = routerInterceptors.get(routerActionType) || [];
        for (let i = 0; i < interceptors?.length; i += 1) {
          interceptors[i]({ history }, dispatch);
        }
      },
      [dispatch, history]
    );

    useEffect(() => {
      handleRouterInterceptors(routerAction.beforeMounted);
      // console.log("组件加载中");
      return () => {
        handleRouterInterceptors(routerAction.beforeUnmounted);
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
}
