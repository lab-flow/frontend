import DashboardCard from "../../components/basic/DashboardCard";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames.ts";
import { Box, Button, Card, Typography } from "@mui/material";
import { PrivateComponent } from "../../components/PrivateComponent";
import { ADMIN_ROLE } from "../../api/enums/userRoles";
import { StyledForm } from "../../components/basic/StyledForm";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { DataProviders } from "../../api/dataProviders/DataProvider.ts";
import { useContext, useState } from "react";
import { APIAlertContext } from "../../providers/alertProvider.tsx";

function UserManual() {
  const { register, handleSubmit, reset } = useForm();

  const { addAlert } = useContext(APIAlertContext);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: addUserManual } = useMutation(
    DataProviders.USER_MANUAL.updateAllMultipartItemWithoutId,
    {
      onMutate: () => {
        setIsLoading(true);
      },
      onSuccess: () => {
        addAlert(Names.updated_user_manual, "success");
        setIsLoading(false);
        reset();
      },
      onError: () => {
        addAlert(Names.error_occurred, "error");
        setIsLoading(false);
      },
    },
  );

  const { mutate: getUserManual } = useMutation(
    () => DataProviders.USER_MANUAL.getItem(),
    {
      onMutate: () => {
        setIsLoading(true);
      },
      onSuccess: (response) => {
        addAlert(Names.user_manual_in_new_card, "success");
        window.open(response.data.user_manual, "_blank");
        setIsLoading(false);
      },
      onError: () => {
        addAlert(Names.user_manual_not_found, "error");
        setIsLoading(false);
      },
    },
  );

  const userManualSubmit = (
    <PrivateComponent
      component={() => (
        <Card variant="outlined" sx={{ padding: "20px", marginTop: "30px" }}>
          <Typography variant="h6">
            Aktualizowanie instrukcji obsługi:
          </Typography>
          <StyledForm>
            <input
              {...register("user_manual", {})}
              multiple={false}
              type="file"
              name="user_manual"
            />
            <Box></Box>
            <Button
              onClick={handleSubmit(
                addUserManual as SubmitHandler<FieldValues>,
              )}
              variant="contained"
              type="submit"
            >
              {Names.update_user_manual}
            </Button>
          </StyledForm>
        </Card>
      )}
      roles={[ADMIN_ROLE]}
    />
  );

  const userManualOpen = (
    <Button variant="contained" color="primary" onClick={() => getUserManual()}>
      {Names.open}
    </Button>
  );

  return DashboardCard({
    title: Names.user_manual,
    isLoading: isLoading,
    content: (
      <>
        {userManualOpen}
        {userManualSubmit}
      </>
    ),
  });
}

export default UserManual;
