import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { Names } from "../../api/common/dataNames";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";

interface NewItemPopupProps {
  formComponent: (setOpen: (open: boolean) => void) => JSX.Element;
}

function NewItemPopup(props: NewItemPopupProps) {
  const [openFormPopup, setOpenFormPopup] = useState<boolean>(false);

  return (
    <>
      <Tooltip title={Names.add_new}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenFormPopup(true)}
          style={{
            maxWidth: "35px",
            maxHeight: "35px",
            minWidth: "35px",
            minHeight: "35px",
            margin: "auto",
            borderRadius: "30px",
          }}
        >
          <AddIcon style={{ margin: "auto" }} />
        </Button>
      </Tooltip>
      {openFormPopup && props.formComponent(setOpenFormPopup)}
    </>
  );
}

export default NewItemPopup;
