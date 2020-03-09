import React from "react";

export const ExternalLink: React.FC<JSX.IntrinsicElements["a"]> = ({
  children,
  ...rest
}) => (
  <a target="_blank" rel="noopener noreferrer" {...rest}>
    {children}
  </a>
);
