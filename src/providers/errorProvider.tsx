// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useCallback, useState } from "react";

export const APIErrorContext = React.createContext({
  error: null,
  addError: (message: string) => {},
  removeError: () => {},
});

export default function APIErrorProvider({ children }) {
  const [error, setError] = useState();

  window.onunhandledrejection = function (e) {
    const data = e?.reason?.response?.data;
    if (data) {
      addError(data);
    } else {
      addError("Wystąpił nieznany błąd");
    }
  };

  const removeError = () => setError(null);

  const addError = (error: string) => setError(error);

  const contextValue = {
    error,
    addError: useCallback((message, status) => addError(message, status), []),
    removeError: useCallback(() => removeError(), []),
  };

  return (
    <APIErrorContext.Provider value={contextValue} key={"api-error-provider"}>
      {children}
    </APIErrorContext.Provider>
  );
}
