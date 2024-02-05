import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
import { Names } from "../../api/common/dataNames";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Button variant="outlined" onClick={() => navigate(-1)}>
      {Names.back}
    </Button>
  );
}
