import React, { useRef } from "react";
import { FC } from "react";
import { useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "./index.scss";

const Transition: FC = ({ children }) => {
  const location = useLocation();
  const nodeRef = useRef(null);

  return children ? (
    <SwitchTransition mode="out-in">
      <CSSTransition
        nodeRef={nodeRef}
        key={location.pathname}
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
