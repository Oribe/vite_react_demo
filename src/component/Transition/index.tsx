import * as H from "history";
import React, { FC, useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { animateBlackList } from "route/index";
import "./index.scss";

let pathname = "";

const Transition: FC<Props> = ({ location, children }) => {
  const nodeRef = useRef(null);

  /**
   * 过渡动画过滤
   */
  const testPathname = (pn: string) => {
    return animateBlackList?.some((item) => {
      if (item.test(pn)) {
        return true;
      }
      return false;
    });
  };

  if (!testPathname(location.pathname)) {
    pathname = location.pathname;
  }

  return (
    <>
      {children ? (
        <SwitchTransition mode="out-in">
          <CSSTransition
            nodeRef={nodeRef}
            key={pathname}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <div className="page" ref={nodeRef}>
              {children}
            </div>
          </CSSTransition>
        </SwitchTransition>
      ) : null}
    </>
  );
};

export default Transition;

interface Props {
  location: H.Location;
  pathnames?: (string | number)[];
}
