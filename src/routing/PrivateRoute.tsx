import React from "react";
import { authenticationService } from "../services/authenticationService.ts";
import { Navigate } from "react-router";
import NoPermissions from "../views/basic/NoPermissions.tsx";

interface PrivateRouteProps {
  component: React.ElementType;
  roles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  roles,
  ...rest
}) => {
  const currentUser = authenticationService.currentUserValue;

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (
    roles &&
    !authenticationService.currentUserRoles.some((r) => roles.includes(r))
  ) {
    return <NoPermissions />;
  }

  return <Component {...rest} />;
};
