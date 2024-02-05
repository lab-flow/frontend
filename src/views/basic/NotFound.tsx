import { Container, Typography } from "@mui/material";
import { Names } from "../../api/common/dataNames";

function NotFound() {
  return (
    <Container>
      <Typography variant="h4" component="h1" align="center" mt={5}>
        {Names.page_not_found}
      </Typography>
      <Typography variant="body1" align="center" mt={2}>
        {Names.page_not_found_description}
      </Typography>
    </Container>
  );
}

export default NotFound;
