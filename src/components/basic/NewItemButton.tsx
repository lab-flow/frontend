import { Box, Button, Tooltip } from "@mui/material";
import { Names } from "../../api/common/dataNames";
import AddIcon from "@mui/icons-material/Add";
import { PrivateComponent } from "../PrivateComponent";
import { useNavigate } from "react-router-dom";

interface NewItemButtonProps {
  textBefore?: string;
  href?: string;
  onClick?: () => void;
  roles?: string[] | null;
  margin?: string;
}

function NewItemButton(props: NewItemButtonProps) {
  const navigate = useNavigate();
  const addNewButton = () => (
    <Tooltip title={Names.add_new}>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          props.onClick ? props.onClick() : navigate(props?.href || "")
        }
        style={{
          marginLeft: "15px",
          maxWidth: "35px",
          maxHeight: "35px",
          minWidth: "35px",
          minHeight: "35px",
          margin: props.margin || "auto",
          borderRadius: "30px",
        }}
      >
        <AddIcon style={{ margin: "auto" }} />
      </Button>
    </Tooltip>
  );
  return (
    <Box>
      <Box style={{ display: "inline", marginRight: "10px" }}>
        {props.textBefore}
      </Box>
      <PrivateComponent component={addNewButton} roles={props.roles} />
      <Box sx={{ m: 1 }} />
    </Box>
  );
}

export default NewItemButton;
