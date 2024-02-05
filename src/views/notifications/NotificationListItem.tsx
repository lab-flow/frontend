import { Box } from "@mui/material";
import "../../api/dataProviders/dataProviders.ts";
import { ReactNode } from "react";

function NotificationListItem(props: {
  key: string;
  onClick: () => void;
  content: ReactNode;
}) {
  return (
    <Box
      key={props.key}
      sx={{
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        transition: "background-color 0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f0f2f5";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "inherit";
      }}
      onClick={props.onClick}
    >
      {props.content}
    </Box>
  );
}

export default NotificationListItem;
