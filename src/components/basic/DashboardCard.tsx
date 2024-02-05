import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchBar from "./SearchBar.tsx";
import React, { ReactNode } from "react";

interface DashboardCardProps {
  title: string | ReactNode;
  content: ReactNode;
  isLoading?: boolean;
  refreshEnabled?: boolean;
  refreshData?: () => void;
  searchEnabled?: boolean;
  handleSearchChange?: (searchTerm: string) => void;
  style?: React.CSSProperties;
}

function DashboardCard(props: DashboardCardProps) {
  if (props.searchEnabled && !props.handleSearchChange) {
    throw new Error(
      "handleSearchChange is required when searchEnabled is true",
    );
  }

  if (props.refreshEnabled && !props.refreshData) {
    throw new Error("refreshData is required when refreshEnabled is true");
  }

  return (
    <Card variant="outlined" style={props.style}>
      <CardContent>
        {props.refreshEnabled ? (
          <Box sx={{ display: "flex" }}>
            <Typography variant="h5">{props.title}</Typography>
            <IconButton onClick={props.refreshData}>
              <RefreshIcon />
            </IconButton>
          </Box>
        ) : (
          <Typography variant="h5">{props.title}</Typography>
        )}
        {props.searchEnabled && props.handleSearchChange && (
          <SearchBar handleSearchChange={props.handleSearchChange} />
        )}
        {props.isLoading ? (
          <div style={{ position: "relative" }}>
            {props.isLoading && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(16, 67, 94, 0.05)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 1,
                }}
              >
                <CircularProgress color="secondary" />
              </div>
            )}
            {props.content}
          </div>
        ) : (
          props.content
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
