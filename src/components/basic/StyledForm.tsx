import { styled } from "@mui/material";

export const StyledForm = styled("form")(({ theme }) => ({
  "& *": {
    marginBottom: theme.spacing(1),
  },
}));
