import * as H from "history";
import React, { FC, useRef } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./index.scss";

const Transition: FC<Props> = ({ location, children }) => {
  const nodeRef = useRef(null);

  return children ? (
    <SwitchTransition mode="out-in">
      <CSSTransition
        nodeRef={nodeRef}
        key={location.pathname}
        timeout={300}
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
  location: H.Location;
  pathnames?: (string | number)[];
}
