import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./index.scss";

const Transition: FC<Props> = ({ pathnames, children }) => {
  const location = useLocation();
  const [prePathname, setPrePathname] = useState(location.pathname);
  const nodeRef = useRef(null);

  useEffect(() => {
    const { pathname } = location;
    if (pathnames?.includes(pathname)) {
      console.log("pathname", pathname);
      setPrePathname(pathname);
    }
  }, [location, pathnames]);

  return children ? (
    <SwitchTransition mode="out-in">
      <CSSTransition
        nodeRef={nodeRef}
        key={prePathname}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div className="page" ref={nodeRef}>
          {children}
        </div>
      </CSSTransition>
    </SwitchTransition>
  ) : null;
};

export default Transition;

interface Props {
  pathnames: (string | number)[];
}
