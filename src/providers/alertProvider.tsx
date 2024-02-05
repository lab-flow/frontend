// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { ReactNode, useCallback, useState } from "react";
import { AlertColor } from "@mui/material/Alert/Alert";

export const APIAlertContext: React.Context<{
  alert: { message: string; severity: AlertColor; date: number };
  addAlert: (message: string, severity: AlertColor) => void;
  removeAlert: () => void;
}> = React.createContext({});

export default function APIAlertProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [alert, setAlert] = useState<{
    message: string;
    severity: AlertColor;
    date: number;
  }>();
  const removeAlert = () => {
    setAlert(undefined);
  };

  const addAlert = (alert: string, severity: AlertColor) => {
    setAlert(undefined);
    setAlert({ message: alert, severity: severity, date: Date.now() });
  };

  const contextValue = {
    alert: alert,
    addAlert: useCallback(
      (message: string, severity: AlertColor) => addAlert(message, severity),
      [],
    ),
    removeAlert: useCallback(() => removeAlert(), []),
  };

  return (
    <APIAlertContext.Provider value={contextValue}>
      {children}
    </APIAlertContext.Provider>
  );
}
