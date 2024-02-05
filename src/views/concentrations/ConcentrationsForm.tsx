import { Controller, useForm } from "react-hook-form";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import Button from "@mui/material/Button";
import { StyledForm } from "../../components/basic/StyledForm";
import { ADMIN_ROLE } from "../../api/enums/userRoles";
import { authenticationService } from "../../services/authenticationService";
import { ConcentrationsInterface } from "../../api/interfaces/concentrations.ts";

interface ConcentrationsFormProps {
  onSubmit: (data: ConcentrationsInterface) => void;
  defaultValues?: ConcentrationsInterface;
  setOpen?: (value: boolean) => void;
  edit?: boolean;
}

function ConcentrationsForm(props: ConcentrationsFormProps) {
  const { currentUserRoles } = authenticationService;
  const { control, handleSubmit } = useForm<ConcentrationsInterface>({
    defaultValues: props.defaultValues || {},
  });

  return (
    <StyledForm>
      <Controller
        control={control}
        name="concentration"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.concentration}
            required
            {...field}
          />
        )}
      />
      {props.edit && (
        <Controller
          control={control}
          name="is_validated_by_admin"
          render={({ field }) => (
            <FormControlLabel
              sx={{ width: "100%" }}
              control={
                <Checkbox
                  disabled={!currentUserRoles.includes(ADMIN_ROLE)}
                  defaultChecked={props.defaultValues?.is_validated_by_admin}
                  {...field}
                />
              }
              label={Names.is_validated_by_admin}
            />
          )}
        />
      )}
      <Button
        onClick={handleSubmit(props.onSubmit)}
        variant="contained"
        type="submit"
      >
        {Names.send}
      </Button>
    </StyledForm>
  );
}

export default ConcentrationsForm;
