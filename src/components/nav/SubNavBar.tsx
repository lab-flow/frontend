import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ReactNode } from "react";

interface SubNavBarProps {
  items: Array<{
    name: string;
    id: string;
    icon?: ReactNode;
    component: ReactNode;
    dividerBefore?: boolean;
    visible?: boolean;
  }>;
  baseUrl: string;
}

export default function SubNavBar(props: SubNavBarProps) {
  const navigateTo = useNavigate();
  return (
    <Box>
      <Divider />
      <List>
        {props.items
          .filter((item) => item.visible)
          .map((item) => (
            <Box key={item.id}>
              {item.dividerBefore && (
                <Divider style={{ margin: "20px 10px" }} />
              )}
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  onClick={() => navigateTo(`${props.baseUrl}${item.id}`)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            </Box>
          ))}
      </List>
    </Box>
  );
}
