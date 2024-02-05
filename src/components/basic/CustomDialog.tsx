import Button from "@mui/material/Button";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

interface CustomDialogProps {
  open: boolean;
  setDialogOpen: (val: boolean) => void;
  title: string;
  content: ReactNode;
  firstButtonLabel?: string;
  firstButtonHandler?: () => void;
  secondButtonLabel?: string;
  secondButtonHandler?: () => void;
}

export default function CustomDialog(props: CustomDialogProps) {
  const disabledButtons =
    props.firstButtonLabel === undefined &&
    props.secondButtonLabel === undefined;
  return (
    <Dialog
      fullWidth
      open={props.open}
      onClose={() => props.setDialogOpen(false)}
    >
      <DialogTitle>
        <Typography variant="body1" sx={{ fontSize: 18, fontWeight: "bold" }}>
          {props.title}
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => props.setDialogOpen(false)}
          aria-label="close"
          sx={{ position: "absolute", right: 20, top: 10 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{props.content}</DialogContent>
      {!disabledButtons && (
        <DialogActions>
          <Button onClick={props.secondButtonHandler} color="primary">
            {props.secondButtonLabel}
          </Button>

          <Button
            variant="contained"
            onClick={props.firstButtonHandler}
            color="primary"
          >
            {props.firstButtonLabel}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
