import { Container, Typography } from "@mui/material";
import { Names } from "../../api/common/dataNames";

function NoPermissions() {
  return (
    <Container>
      <Typography variant="h4" component="h1" align="center" mt={5}>
        {Names.no_permissions}
      </Typography>
      <Typography variant="body1" align="center" mt={2}>
        {Names.no_permissions_description}
      </Typography>
    </Container>
  );
}

export default NoPermissions;
