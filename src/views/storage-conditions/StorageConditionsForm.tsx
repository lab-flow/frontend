import { Controller, useForm } from "react-hook-form";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import "../../api/dataProviders/dataProviders";
import { Names } from "../../api/common/dataNames";
import Button from "@mui/material/Button";
import { StyledForm } from "../../components/basic/StyledForm";
import { ADMIN_ROLE } from "../../api/enums/userRoles";
import { authenticationService } from "../../services/authenticationService";
import { StorageConditionInterface } from "../../api/interfaces/storageCondition.ts";

interface StorageConditionsFormProps {
  onSubmit: (data: StorageConditionInterface) => void;
  defaultValues?: StorageConditionInterface;
  setOpen?: (value: boolean) => void;
  edit?: boolean;
}

function StorageConditionsForm(props: StorageConditionsFormProps) {
  const { currentUserRoles } = authenticationService;
  const { control, handleSubmit } = useForm<StorageConditionInterface>({
    defaultValues: props.defaultValues || {},
  });

  return (
    <StyledForm>
      <Controller
        control={control}
        name="storage_condition"
        render={({ field }) => (
          <TextField
            sx={{ width: "100%" }}
            label={Names.storage_conditions}
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

export default StorageConditionsForm;
