import React, { ElementType } from "react";

import { authenticationService } from "../services/authenticationService.ts";

interface PrivateComponentProps {
  component: ElementType;
  roles?: string[] | null;
}

export const PrivateComponent: React.FC<PrivateComponentProps> = ({
  component: Component,
  roles,
  ...rest
}) => {
  if (
    roles &&
    !authenticationService.currentUserRoles.some((r) => roles.includes(r))
  ) {
    return <></>;
  } else {
    return <Component {...rest} />;
  }
};
