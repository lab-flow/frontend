import { MouseEventHandler, useContext } from "react";
import { Alert, IconButton } from "@mui/material";
import { APIAlertContext } from "../../providers/alertProvider";
import CloseIcon from "@mui/icons-material/Close";
import { AlertColor } from "@mui/material/Alert/Alert";

export default function Alerts() {
  const { alert, removeAlert } = useContext(APIAlertContext);

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
            onClick={removeAlert as MouseEventHandler}
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
