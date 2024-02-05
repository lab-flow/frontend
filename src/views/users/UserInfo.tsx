import DashboardCard from "../../components/basic/DashboardCard.tsx";
import { Box, Typography } from "@mui/material";
import { Names } from "../../api/common/dataNames.ts";
import {
  CustomCloseIcon,
  CustomDoneIcon,
} from "../../components/icons/CustomIcons.ts";
import { UserInterface } from "../../api/interfaces/user.ts";
import { getRoleName } from "../../api/enums/userRoles.ts";

function UserInfo(user: UserInterface | null, isLoading: boolean) {
  const content = user ? (
    <Box style={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.id}: </b> {user.id || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.username}: </b> {user.username || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.email}: </b> {user.email || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.first_name}: </b> {user.first_name || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.last_name}: </b> {user.last_name || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.last_login}: </b> {user.last_login || "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.lab_roles}:</b>{" "}
        {user.lab_roles.length > 0
          ? user.lab_roles.map((roleId) => getRoleName(roleId)).join(", ")
          : "-"}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        <b>{Names.is_staff}: </b>{" "}
        {user.is_staff ? <CustomDoneIcon /> : <CustomCloseIcon />}
      </Typography>
    </Box>
  ) : (
    <></>
  );

  return DashboardCard({
    title: "",
    isLoading,
    content,
  });
}

export default UserInfo;
