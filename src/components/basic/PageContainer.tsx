import { Container as MuiContainer, styled } from "@mui/material";

export const WidePageContainer = styled(MuiContainer)({
  margin: "0 auto",
  minHeight: "calc(100vh - 300px)",
  maxWidth: "100vw",
  marginTop: "100px",
  "h4 + p": {
    marginTop: "10px",
  },
  "@media (max-width: 600px)": {
    maxWidth: "90%",
  },
});
