import { useEffect, useContext } from "react";
import { Alert, IconButton } from "@mui/material";
import { APIAlertContext } from "../../providers/alertProvider";
import CloseIcon from "@mui/icons-material/Close";
import { AlertColor } from "@mui/material/Alert/Alert";

export default function Alerts() {
  const { alert, removeAlert } = useContext(APIAlertContext);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        removeAlert();
      }, 7000); 

      return () => clearTimeout(timer);
    }
  }, [alert, removeAlert]);

  return (
    alert && (
      <Alert
        variant="filled"
        severity={alert?.severity as AlertColor}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={removeAlert}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {alert?.message}
      </Alert>
    )
  );
}
