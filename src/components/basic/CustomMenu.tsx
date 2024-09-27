import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface CustomMenuProps {
  items: Array<{ name: string; handler: () => void }>;
}

export default function CustomMenu(props: CustomMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return props.items?.length > 0 ? (
    <div>
      <IconButton
        id="basic-button"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {props.items.map((item) => (
          <MenuItem
            key={item.name}
            onClick={() => {
              item.handler();
              handleClose();
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  ) : (
    <>-</>
  );
}
