import theme from "../../theme.ts";
import { styled } from "@mui/material";

import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

export const CustomDoneIcon = styled(DoneIcon)({
  // eslint-disable-next-line
  // @ts-ignore
  color: theme.palette.main,
  fontSize: "inherit",
});
export const CustomCloseIcon = styled(CloseIcon)({
  // eslint-disable-next-line
  // @ts-ignore
  color: theme.palette.main,
  fontSize: "inherit",
});
