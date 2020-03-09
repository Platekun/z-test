import React from "react";
import ReactDOM from "react-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import "./Progress.css";
import clsx from "clsx";

type Props = {
  show?: boolean;
  variant?: "default" | "page-level";
} & JSX.IntrinsicElements["div"];

export const Progress: React.FC<Props> = ({
  show,
  variant = "default",
  className,
  ...rest
}) => {
  const container = window.document.getElementById("overlay");

  React.useEffect(() => {
    const root = document.querySelector("#root");

    if (!show) {
      enableBodyScroll(root as Element);
    } else {
      disableBodyScroll(root as Element);
    }
  }, [show]);

  if (!container) {
    throw new Error("#modal container is not present on DOM");
  }

  if (typeof show === "boolean" && show) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className={clsx([
        "overlay",
        variant === "page-level" && "overlay--white",
        className
      ])}
      {...rest}
    >
      <div className="progress">
        <div className="cube1"></div>
        <div className="cube2"></div>
      </div>
    </div>,
    container
  );
};
